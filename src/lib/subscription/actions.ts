/**
 * Subscription Server Actions
 * Actions for managing user subscriptions
 * Following SRP: Each action handles one specific subscription task
 * 
 * NEW LOGIC:
 * - Trial cannot be manually selected (auto-assigned on signup)
 * - Paid plans: immediate activation if from trial, end-of-period if from paid plan
 * - Cancellation: returns to trial if days remaining, otherwise disables at expiry
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { logInfo, logError } from '@/lib/logging/logger';
import type { SubscriptionPlan } from '@/types/subscription.types';

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Calculate days remaining from a date to now
 */
function calculateDaysRemaining(expiresAt: string | null): number {
  if (!expiresAt) return 0;
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Subscribe to a paid plan (basic or premium)
 * - From trial: immediate activation
 * - From paid plan: switch at end of current period
 */
export async function subscribeToPlan(
  plan: 'basic' | 'premium',
  billingCycle: 'monthly' | 'yearly'
): Promise<ActionResult> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile) {
      return {
        success: false,
        error: 'You must be logged in to subscribe to a plan.',
      };
    }

    // Admin users have unlimited access
    if (profile.role === 'admin') {
      return {
        success: false,
        error: 'Admin accounts have unlimited access. No subscription needed.',
      };
    }

    // Demo users cannot subscribe
    if (profile.isDemo) {
      return {
        success: false,
        error: 'Demo accounts cannot subscribe to plans.',
      };
    }

    // Note: Trial cannot be selected manually (type system prevents it since plan is 'basic' | 'premium')

    const supabase = await createClient();
    const now = new Date();

    // Calculate expiry date based on billing cycle
    let expiryDate: Date;
    if (billingCycle === 'monthly') {
      expiryDate = new Date(now);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate = new Date(now);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Determine if we should activate immediately or schedule switch
    const currentPlan = profile.subscriptionPlan;
    const isFromTrial = currentPlan === 'trial';
    const isFromPaidPlan = currentPlan === 'basic' || currentPlan === 'premium';
    const currentExpiresAt = profile.subscriptionExpiresAt
      ? new Date(profile.subscriptionExpiresAt)
      : null;
    const isDisabled = profile.isDisabled;

    let updateData: Record<string, unknown> = {
      updated_at: now.toISOString(),
      subscription_cancelled_at: null, // Clear cancellation if resubscribing
      next_plan: null,
      plan_switch_at: null,
    };

    if (isFromTrial) {
      // IMMEDIATE ACTIVATION: Save trial days remaining and activate plan now
      const trialDaysRemaining = calculateDaysRemaining(profile.subscriptionExpiresAt);

      updateData = {
        ...updateData,
        subscription_plan: plan,
        subscription_expires_at: expiryDate.toISOString(),
        trial_days_remaining: trialDaysRemaining,
        trial_used: true,
        is_disabled: false, // Re-enable if user was disabled
        subscription_cancelled_at: null, // Clear cancellation
      };
    } else if (isFromPaidPlan && currentExpiresAt && currentExpiresAt > now) {
      // SCHEDULE SWITCH: Plan changes at end of current period
      updateData = {
        ...updateData,
        next_plan: plan,
        plan_switch_at: currentExpiresAt.toISOString(),
      };
    } else {
      // No active plan or expired: activate immediately
      updateData = {
        ...updateData,
        subscription_plan: plan,
        subscription_expires_at: expiryDate.toISOString(),
        is_disabled: false, // Re-enable user if they subscribe
        subscription_cancelled_at: null, // Clear cancellation
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update(updateData)
      .eq('user_id', profile.userId);

    if (error) {
      logError(
        'subscription',
        'Failed to subscribe to plan',
        new Error(error.message),
        {
          userId: profile.userId,
          plan,
          billingCycle,
          currentPlan,
        }
      );
      return {
        success: false,
        error: 'Failed to subscribe to plan. Please try again.',
      };
    }

    logInfo('subscription', 'Subscription plan subscribed', {
      userId: profile.userId,
      plan,
      billingCycle,
      fromPlan: currentPlan,
      immediate: isFromTrial,
      scheduled: isFromPaidPlan && !isFromTrial,
    });

    // Revalidate relevant paths
    revalidatePath('/app/pricing');
    revalidatePath('/app/account');

    return { success: true };
  } catch (error) {
    logError(
      'subscription',
      'Error subscribing to plan',
      error instanceof Error ? error : new Error(String(error))
    );
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Cancel subscription
 * - If has trial days remaining: returns to trial at expiry
 * - Otherwise: disables user at expiry
 */
export async function cancelSubscription(): Promise<ActionResult> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile) {
      return {
        success: false,
        error: 'You must be logged in to cancel your subscription.',
      };
    }

    // Admin and demo users cannot cancel
    if (profile.role === 'admin' || profile.isDemo) {
      return {
        success: false,
        error: 'You cannot cancel this account type.',
      };
    }

    const currentPlan = profile.subscriptionPlan;
    if (currentPlan === 'trial' || !currentPlan) {
      return {
        success: false,
        error: 'You are not on a paid subscription.',
      };
    }

    const supabase = await createClient();
    const now = new Date();

    // Determine behavior: return to trial or disable
    const hasTrialDays = profile.trialDaysRemaining > 0;
    const updateData: Record<string, unknown> = {
      subscription_cancelled_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    if (hasTrialDays) {
      // Will return to trial at expiry
      updateData.next_plan = 'trial';
      updateData.plan_switch_at = profile.subscriptionExpiresAt;
    } else {
      // Will be disabled at expiry (handled by scheduled job)
      updateData.next_plan = null;
      updateData.plan_switch_at = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update(updateData)
      .eq('user_id', profile.userId);

    if (error) {
      logError(
        'subscription',
        'Failed to cancel subscription',
        new Error(error.message),
        {
          userId: profile.userId,
        }
      );
      return {
        success: false,
        error: 'Failed to cancel subscription. Please try again.',
      };
    }

    logInfo('subscription', 'Subscription cancelled', {
      userId: profile.userId,
      currentPlan,
      willReturnToTrial: hasTrialDays,
      trialDaysRemaining: profile.trialDaysRemaining,
    });

    // Revalidate relevant paths
    revalidatePath('/app/pricing');
    revalidatePath('/app/account');

    return { success: true };
  } catch (error) {
    logError(
      'subscription',
      'Error cancelling subscription',
      error instanceof Error ? error : new Error(String(error))
    );
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

// Keep old function name for backwards compatibility (but it now redirects)
export async function selectSubscriptionPlan(
  plan: SubscriptionPlan,
  billingCycle: 'monthly' | 'yearly'
): Promise<ActionResult> {
  // Trial cannot be selected manually
  if (plan === 'trial') {
    return {
      success: false,
      error: 'Trial is automatically assigned. You cannot manually subscribe to trial.',
    };
  }

  // Redirect to new subscribe function
  return subscribeToPlan(plan as 'basic' | 'premium', billingCycle);
}
