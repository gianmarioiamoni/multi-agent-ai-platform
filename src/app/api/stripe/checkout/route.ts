/**
 * Stripe Checkout API Route
 * Creates a Stripe Checkout session and redirects user to Stripe
 * Following SRP: Only handles checkout session creation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/client';
import { getStripePriceId, getStripeCheckoutUrls } from '@/lib/stripe/constants';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { createClient } from '@/lib/supabase/server';
import { logError, logInfo } from '@/lib/logging/logger';
import type { SubscriptionPlan, BillingCycle } from '@/types/subscription.types';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const profile = await getCurrentUserProfile();
    if (!profile) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Admin and demo users cannot subscribe
    if (profile.role === 'admin' || profile.isDemo) {
      return NextResponse.json(
        { error: 'Admin and demo accounts cannot subscribe to plans.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { plan, billingCycle } = body as {
      plan: SubscriptionPlan;
      billingCycle: BillingCycle;
    };

    // Validate plan and billing cycle
    if (!plan || !billingCycle) {
      return NextResponse.json(
        { error: 'Plan and billing cycle are required' },
        { status: 400 }
      );
    }

    // Trial cannot be subscribed via Stripe
    if (plan === 'trial') {
      return NextResponse.json(
        { error: 'Trial is automatically assigned. Cannot subscribe via Stripe.' },
        { status: 400 }
      );
    }

    // Get Stripe Price ID
    const priceId = getStripePriceId(plan, billingCycle);
    if (!priceId) {
      logError('subscription', 'Stripe Price ID not found', new Error('Price ID not configured'), {
        plan,
        billingCycle,
      });
      return NextResponse.json(
        { error: 'Price ID not configured for this plan. Please contact support.' },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const supabase = await createClient();
    const stripe = getStripeClient();

    // Get user email from auth
    const { getCurrentUser } = await import('@/lib/auth/utils');
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    let customerId = profile.stripeCustomerId;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile.name || undefined,
        metadata: {
          user_id: profile.userId,
          profile_id: profile.id,
        },
      });

      customerId = customer.id;

      // Save customer ID to database
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', profile.userId);

      logInfo('subscription', 'Stripe customer created', {
        userId: profile.userId,
        customerId,
      });
    }

    // Create checkout session
    const { successUrl, cancelUrl } = getStripeCheckoutUrls();

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        user_id: profile.userId,
        profile_id: profile.id,
        plan,
        billing_cycle: billingCycle,
      },
      subscription_data: {
        metadata: {
          user_id: profile.userId,
          profile_id: profile.id,
          plan,
          billing_cycle: billingCycle,
        },
      },
    });

    logInfo('subscription', 'Stripe checkout session created', {
      userId: profile.userId,
      sessionId: session.id,
      plan,
      billingCycle,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    logError(
      'subscription',
      'Failed to create Stripe checkout session',
      error instanceof Error ? error : new Error(String(error)),
      {
        errorMessage: error instanceof Error ? error.message : String(error),
      }
    );

    return NextResponse.json(
      {
        error: 'Failed to create checkout session. Please try again.',
      },
      { status: 500 }
    );
  }
}

