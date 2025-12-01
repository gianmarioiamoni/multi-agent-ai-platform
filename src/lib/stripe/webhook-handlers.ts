/**
 * Stripe Webhook Handlers
 * Handle Stripe webhook events for subscription management
 * Following SRP: Each handler function handles one specific event type
 */

'use server';

import { getStripeClient } from './client';
import { createAdminClient } from '@/lib/supabase/admin';
import { logInfo, logError } from '@/lib/logging/logger';
import type Stripe from 'stripe';
import type { SubscriptionPlan } from '@/types/subscription.types';

/**
 * Map Stripe plan metadata to our subscription plan
 */
function mapStripePlanToSubscriptionPlan(
  planMetadata: Stripe.Metadata | null
): SubscriptionPlan | null {
  if (!planMetadata || !planMetadata.plan) {
    return null;
  }

  const plan = planMetadata.plan as string;
  if (plan === 'basic' || plan === 'premium') {
    return plan;
  }

  return null;
}

/**
 * Calculate expiry date from Stripe subscription
 */
function calculateExpiryDate(subscription: Stripe.Subscription): Date {
  // Use current_period_end which is in Unix timestamp (seconds)
  // Type assertion needed because Stripe types may not expose all properties
  const periodEnd = (subscription as unknown as { current_period_end: number })
    .current_period_end;
  if (!periodEnd) {
    // Fallback: calculate 1 month from now if period_end is missing
    const fallback = new Date();
    fallback.setMonth(fallback.getMonth() + 1);
    return fallback;
  }
  return new Date(periodEnd * 1000);
}

/**
 * Handle checkout.session.completed event
 * Activated when user completes payment and subscription is created
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  try {
    const userId = session.metadata?.user_id;
    const planMetadata = session.metadata?.plan;
    const billingCycle = session.metadata?.billing_cycle;

    if (!userId || !planMetadata) {
      logError(
        'subscription',
        'Checkout session completed but missing required metadata',
        new Error('Missing user_id or plan in metadata'),
        {
          sessionId: session.id,
          metadata: session.metadata,
        }
      );
      return;
    }

    // Get subscription from session
    const subscriptionId = session.subscription as string;
    if (!subscriptionId) {
      logError(
        'subscription',
        'Checkout session completed but no subscription ID',
        new Error('Missing subscription ID in session'),
        {
          sessionId: session.id,
        }
      );
      return;
    }

    // Get subscription details from Stripe
    const stripe = getStripeClient();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const plan = mapStripePlanToSubscriptionPlan(session.metadata);
    if (!plan) {
      logError(
        'subscription',
        'Invalid plan in checkout session metadata',
        new Error(`Unknown plan: ${planMetadata}`),
        {
          sessionId: session.id,
          planMetadata,
        }
      );
      return;
    }

    const supabase = await createAdminClient();
    const now = new Date();
    const expiryDate = calculateExpiryDate(subscription);

    // Check if user already has an active paid subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingProfile, error: fetchError } = await (supabase as any)
      .from('profiles')
      .select(
        'subscription_plan, subscription_expires_at, stripe_subscription_id, trial_days_remaining'
      )
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      logError(
        'subscription',
        'Failed to fetch existing profile for checkout completion',
        new Error(fetchError.message),
        {
          userId,
          sessionId: session.id,
        }
      );
      return;
    }

    const currentPlan = existingProfile?.subscription_plan;
    const currentExpiresAt = existingProfile?.subscription_expires_at
      ? new Date(existingProfile.subscription_expires_at)
      : null;
    const hasActivePaidPlan =
      currentPlan === 'basic' || currentPlan === 'premium';
    const currentSubscriptionId = existingProfile?.stripe_subscription_id;

    let updateData: Record<string, unknown> = {
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: subscription.items.data[0]?.price.id || null,
      is_disabled: false, // Re-enable user if they were disabled
      subscription_cancelled_at: null, // Clear cancellation
      updated_at: now.toISOString(),
    };

    // If user has an active paid subscription and it hasn't expired yet
    // Schedule the plan change instead of activating immediately
    if (
      hasActivePaidPlan &&
      currentExpiresAt &&
      currentExpiresAt > now &&
      currentSubscriptionId &&
      currentSubscriptionId !== subscriptionId
    ) {
      // Schedule plan change for end of current period
      updateData = {
        ...updateData,
        next_plan: plan,
        plan_switch_at: currentExpiresAt.toISOString(),
        // Keep current subscription_plan and expires_at until switch date
      };

      logInfo('subscription', 'Plan change scheduled (existing paid plan)', {
        userId,
        sessionId: session.id,
        currentPlan,
        newPlan: plan,
        switchAt: currentExpiresAt.toISOString(),
      });
    } else {
      // No active paid plan or expired - activate immediately
      // Also activate if coming from trial
      updateData = {
        ...updateData,
        subscription_plan: plan,
        subscription_expires_at: expiryDate.toISOString(),
        next_plan: null, // Clear any scheduled plan change
        plan_switch_at: null, // Clear scheduled switch
      };

      logInfo('subscription', 'Subscription activated immediately after checkout', {
        userId,
        sessionId: session.id,
        plan,
        expiresAt: expiryDate.toISOString(),
        fromTrial: currentPlan === 'trial',
      });
    }

    // Update user profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      logError(
        'subscription',
        'Failed to update profile after checkout completion',
        new Error(error.message),
        {
          userId,
          sessionId: session.id,
          subscriptionId,
          plan,
        }
      );
      return;
    }

    logInfo('subscription', 'Subscription activated after checkout', {
      userId,
      sessionId: session.id,
      subscriptionId,
      plan,
      billingCycle,
      expiresAt: expiryDate.toISOString(),
    });
  } catch (error) {
    logError(
      'subscription',
      'Error handling checkout session completed',
      error instanceof Error ? error : new Error(String(error)),
      {
        sessionId: session.id,
      }
    );
  }
}

/**
 * Handle customer.subscription.updated event
 * Activated when subscription is updated (plan change, renewal, etc.)
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  try {
    const userId = subscription.metadata?.user_id;
    const planMetadata = subscription.metadata?.plan;

    if (!userId || !planMetadata) {
      logError(
        'subscription',
        'Subscription updated but missing required metadata',
        new Error('Missing user_id or plan in metadata'),
        {
          subscriptionId: subscription.id,
          metadata: subscription.metadata,
        }
      );
      return;
    }

    const plan = mapStripePlanToSubscriptionPlan(subscription.metadata);
    if (!plan) {
      logError(
        'subscription',
        'Invalid plan in subscription metadata',
        new Error(`Unknown plan: ${planMetadata}`),
        {
          subscriptionId: subscription.id,
          planMetadata,
        }
      );
      return;
    }

    const supabase = await createAdminClient();
    const now = new Date();
    const expiryDate = calculateExpiryDate(subscription);

    // Update subscription details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        subscription_plan: plan,
        subscription_expires_at: expiryDate.toISOString(),
        stripe_price_id: subscription.items.data[0]?.price.id || null,
        updated_at: now.toISOString(),
      })
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      logError(
        'subscription',
        'Failed to update profile after subscription update',
        new Error(error.message),
        {
          userId,
          subscriptionId: subscription.id,
          plan,
        }
      );
      return;
    }

    logInfo('subscription', 'Subscription updated', {
      userId,
      subscriptionId: subscription.id,
      plan,
      expiresAt: expiryDate.toISOString(),
      status: subscription.status,
    });
  } catch (error) {
    logError(
      'subscription',
      'Error handling subscription updated',
      error instanceof Error ? error : new Error(String(error)),
      {
        subscriptionId: subscription.id,
      }
    );
  }
}

/**
 * Handle customer.subscription.deleted event
 * Activated when subscription is cancelled or deleted
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  try {
    const userId = subscription.metadata?.user_id;

    if (!userId) {
      logError(
        'subscription',
        'Subscription deleted but missing user_id in metadata',
        new Error('Missing user_id in metadata'),
        {
          subscriptionId: subscription.id,
          metadata: subscription.metadata,
        }
      );
      return;
    }

    const supabase = await createAdminClient();
    const now = new Date();

    // Get current profile to check if user has trial days remaining
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: fetchError } = await (supabase as any)
      .from('profiles')
      .select('trial_days_remaining, subscription_plan')
      .eq('user_id', userId)
      .single();

    if (fetchError || !profile) {
      logError(
        'subscription',
        'Failed to fetch profile for subscription deletion',
        new Error(fetchError?.message || 'Profile not found'),
        {
          userId,
          subscriptionId: subscription.id,
        }
      );
      return;
    }

    const hasTrialDays = profile.trial_days_remaining > 0;

    // Update profile: mark subscription as cancelled
    // If user has trial days, they'll return to trial at expiry
    // Otherwise, they'll be disabled at expiry (handled by cron job)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        subscription_cancelled_at: now.toISOString(),
        stripe_subscription_id: null, // Clear subscription ID
        updated_at: now.toISOString(),
        // Don't change subscription_plan or expires_at yet - let cron job handle it
        // This allows user to continue using the service until expiry
      })
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      logError(
        'subscription',
        'Failed to update profile after subscription deletion',
        new Error(error.message),
        {
          userId,
          subscriptionId: subscription.id,
        }
      );
      return;
    }

    logInfo('subscription', 'Subscription cancelled/deleted', {
      userId,
      subscriptionId: subscription.id,
      hasTrialDays,
      willReturnToTrial: hasTrialDays,
    });
  } catch (error) {
    logError(
      'subscription',
      'Error handling subscription deleted',
      error instanceof Error ? error : new Error(String(error)),
      {
        subscriptionId: subscription.id,
      }
    );
  }
}

/**
 * Handle invoice.payment_succeeded event
 * Activated when a subscription payment is successfully processed
 */
export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  try {
    // Type assertion needed because Stripe types may not expose subscription property correctly
    const invoiceData = invoice as unknown as { subscription?: string | { id: string } | null };
    const subscriptionId =
      typeof invoiceData.subscription === 'string'
        ? invoiceData.subscription
        : invoiceData.subscription?.id;
    if (!subscriptionId) {
      // Not a subscription invoice, skip
      return;
    }

    // Get subscription to find user
    const stripe = getStripeClient();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.user_id;

    if (!userId) {
      logError(
        'subscription',
        'Invoice payment succeeded but missing user_id',
        new Error('Missing user_id in subscription metadata'),
        {
          invoiceId: invoice.id,
          subscriptionId,
        }
      );
      return;
    }

    const supabase = await createAdminClient();
    const expiryDate = calculateExpiryDate(subscription);

    // Update subscription expiry date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        subscription_expires_at: expiryDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscriptionId);

    if (error) {
      logError(
        'subscription',
        'Failed to update subscription expiry after payment',
        new Error(error.message),
        {
          userId,
          invoiceId: invoice.id,
          subscriptionId,
        }
      );
      return;
    }

    logInfo('subscription', 'Subscription renewed (payment succeeded)', {
      userId,
      invoiceId: invoice.id,
      subscriptionId,
      expiresAt: expiryDate.toISOString(),
    });
  } catch (error) {
    logError(
      'subscription',
      'Error handling invoice payment succeeded',
      error instanceof Error ? error : new Error(String(error)),
      {
        invoiceId: invoice.id,
      }
    );
  }
}

/**
 * Handle invoice.payment_failed event
 * Activated when a subscription payment fails
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  try {
    // Type assertion needed because Stripe types may not expose subscription property correctly
    const invoiceData = invoice as unknown as { subscription?: string | { id: string } | null };
    const subscriptionId =
      typeof invoiceData.subscription === 'string'
        ? invoiceData.subscription
        : invoiceData.subscription?.id;
    if (!subscriptionId) {
      return;
    }

    // Get subscription to find user
    const stripe = getStripeClient();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata?.user_id;

    if (!userId) {
      logError(
        'subscription',
        'Invoice payment failed but missing user_id',
        new Error('Missing user_id in subscription metadata'),
        {
          invoiceId: invoice.id,
          subscriptionId,
        }
      );
      return;
    }

    // Log the payment failure (we don't disable user immediately - Stripe will retry)
    logError(
      'subscription',
      'Subscription payment failed',
      new Error(`Payment failed for invoice ${invoice.id}`),
      {
        userId,
        invoiceId: invoice.id,
        subscriptionId,
        attemptCount: invoice.attempt_count,
      }
    );

    // Note: We don't disable the user here - Stripe will retry payments
    // The subscription remains active during the retry period
    // If all retries fail, Stripe will cancel the subscription and we'll handle that via
    // customer.subscription.deleted event
  } catch (error) {
    logError(
      'subscription',
      'Error handling invoice payment failed',
      error instanceof Error ? error : new Error(String(error)),
      {
        invoiceId: invoice.id,
      }
    );
  }
}

