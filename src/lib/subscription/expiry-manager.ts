/**
 * Subscription Expiry Manager
 * Handles subscription expiry checks, user disabling, plan transitions, and notifications
 * Following SRP: Only handles subscription expiry logic
 */

'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { logInfo, logError } from '@/lib/logging/logger';
import { createScopedLogger } from '@/lib/logging/scoped-logger';
import {
  sendSubscriptionExpiringSoonEmail,
  sendSubscriptionExpiredEmail,
  sendAccountDisabledEmail,
} from './email-notifications';

const logger = createScopedLogger({
  category: 'subscription',
  context: { scope: 'SubscriptionExpiryManager' },
});

/**
 * Calculate days remaining until expiry
 */
function calculateDaysRemaining(expiresAt: string): number {
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if notification was already sent
 */
async function wasNotificationSent(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  notificationType: 'expiring_soon' | 'expired' | 'disabled',
  subscriptionExpiresAt: string | null
): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('subscription_notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('notification_type', notificationType)
      .eq('subscription_expires_at', subscriptionExpiresAt || null)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      logger.error('Error checking notification status', { error: error.message });
      return false;
    }

    return !!data;
  } catch (error) {
    logger.error('Exception checking notification status', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Mark notification as sent
 */
async function markNotificationSent(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  notificationType: 'expiring_soon' | 'expired' | 'disabled',
  subscriptionExpiresAt: string | null
): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('subscription_notifications').insert({
      user_id: userId,
      notification_type: notificationType,
      subscription_expires_at: subscriptionExpiresAt || null,
    });
  } catch (error) {
    logger.error('Failed to mark notification as sent', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get user email from auth.users
 */
async function getUserEmail(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string
): Promise<string | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .auth.admin.getUserById(userId);

    if (error || !data?.user?.email) {
      logger.error('Failed to get user email', { userId, error: error?.message });
      return null;
    }

    return data.user.email;
  } catch (error) {
    logger.error('Exception getting user email', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Get plan display name
 */
function getPlanDisplayName(plan: string | null): string {
  switch (plan) {
    case 'trial':
      return 'Trial';
    case 'basic':
      return 'Basic';
    case 'premium':
      return 'Premium';
    default:
      return 'Free';
  }
}

/**
 * Process subscription expiry checks and actions
 * This function is called by the cron job
 */
export async function processSubscriptionExpiries(): Promise<{
  processed: number;
  disabled: number;
  notified: number;
  errors: number;
}> {
  const stats = {
    processed: 0,
    disabled: 0,
    notified: 0,
    errors: 0,
  };

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    const twoDaysFromNowISO = twoDaysFromNow.toISOString();

    // Get all users with active subscriptions (not admin, not demo)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profiles, error: fetchError } = await (supabase as any)
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .eq('is_demo', false)
      .not('subscription_expires_at', 'is', null)
      .gte('subscription_expires_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()) // Last 3 days + future
      .order('subscription_expires_at', { ascending: true });

    if (fetchError) {
      logger.error('Failed to fetch profiles for expiry check', {
        error: fetchError.message,
      });
      return stats;
    }

    if (!profiles || profiles.length === 0) {
      logger.info('No profiles to process for subscription expiry');
      return stats;
    }

    logger.info('Processing subscription expiries', { count: profiles.length });

    for (const profile of profiles) {
      stats.processed++;

      try {
        const expiresAt = profile.subscription_expires_at;
        const userId = profile.user_id;
        const subscriptionPlan = profile.subscription_plan;
        const nextPlan = profile.next_plan;
        const planSwitchAt = profile.plan_switch_at;
        const subscriptionCancelledAt = profile.subscription_cancelled_at;
        const isDisabled = profile.is_disabled;
        const userName = profile.name || null;

        if (!expiresAt) continue;

        const daysRemaining = calculateDaysRemaining(expiresAt);
        const expiryDate = new Date(expiresAt);
        const nowDate = new Date();
        const isExpired = expiryDate <= nowDate;
        const isExpiringSoon = daysRemaining <= 2 && daysRemaining > 0;

        // Get user email
        const userEmail = await getUserEmail(supabase, userId);
        if (!userEmail) {
          stats.errors++;
          continue;
        }

        // 1. Handle plan switching (if scheduled)
        if (nextPlan && planSwitchAt && new Date(planSwitchAt) <= nowDate) {
          await handlePlanSwitch(supabase, profile, nextPlan);
          stats.processed++;
          continue; // Skip other checks for this user
        }

        // 2. Handle expired subscriptions
        if (isExpired) {

          // Check if cancelled and has trial days remaining
          if (subscriptionCancelledAt && profile.trial_days_remaining > 0) {
            // Return to trial
            await returnToTrial(supabase, profile);
            continue;
          }

          // Send expired notification if not already sent
          if (!(await wasNotificationSent(supabase, userId, 'expired', expiresAt))) {
            const planName = getPlanDisplayName(subscriptionPlan);
            const sent = await sendSubscriptionExpiredEmail(userEmail, userName, planName);
            if (sent) {
              await markNotificationSent(supabase, userId, 'expired', expiresAt);
              stats.notified++;
            }
          }

          // Disable user if expired and no recovery path
          // Don't disable if:
          // - Already disabled
          // - Has next_plan scheduled (will be handled above)
          // - Has cancellation (already handled above)
          if (!isDisabled && !nextPlan && !subscriptionCancelledAt) {
            // No recovery path: disable user
            await disableUser(supabase, userId, userEmail, userName, expiresAt);
            stats.disabled++;
          }
        }

        // 3. Handle expiring soon (2 days before)
        if (isExpiringSoon && !isExpired) {
          if (!(await wasNotificationSent(supabase, userId, 'expiring_soon', expiresAt))) {
            const planName = getPlanDisplayName(subscriptionPlan);
            const sent = await sendSubscriptionExpiringSoonEmail(
              userEmail,
              userName,
              planName,
              expiresAt
            );
            if (sent) {
              await markNotificationSent(supabase, userId, 'expiring_soon', expiresAt);
              stats.notified++;
            }
          }
        }
      } catch (error) {
        stats.errors++;
        logger.error('Error processing profile for expiry', {
          profileId: profile.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    logger.info('Subscription expiry processing completed', stats);
    return stats;
  } catch (error) {
    logger.error('Fatal error in processSubscriptionExpiries', {
      error: error instanceof Error ? error.message : String(error),
    });
    return stats;
  }
}

/**
 * Handle plan switch at expiry
 */
async function handlePlanSwitch(
  supabase: ReturnType<typeof createAdminClient>,
  profile: {
    id: string;
    user_id: string;
    subscription_plan: string | null;
    subscription_expires_at: string | null;
    next_plan: string | null;
    plan_switch_at: string | null;
  },
  nextPlan: string
): Promise<void> {
  try {
    const now = new Date();
    let newExpiryDate: Date;

    // Calculate new expiry based on plan (assume monthly for now, could be enhanced)
    if (nextPlan === 'trial') {
      // Trial: use trial_days_remaining
      newExpiryDate = new Date(now);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const days = (profile as any).trial_days_remaining || 0;
      if (days > 0) {
        newExpiryDate.setDate(newExpiryDate.getDate() + days);
      } else {
        newExpiryDate.setDate(newExpiryDate.getDate() + 30); // Fallback
      }
    } else {
      // Paid plan: 1 month from now
      newExpiryDate = new Date(now);
      newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('profiles')
      .update({
        subscription_plan: nextPlan,
        subscription_expires_at: newExpiryDate.toISOString(),
        next_plan: null,
        plan_switch_at: null,
        subscription_cancelled_at: null, // Clear cancellation
        updated_at: now.toISOString(),
      })
      .eq('id', profile.id);

    logger.info('Plan switched', {
      userId: profile.user_id,
      fromPlan: profile.subscription_plan,
      toPlan: nextPlan,
    });
  } catch (error) {
    logger.error('Failed to switch plan', {
      profileId: profile.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Return user to trial after cancellation
 */
async function returnToTrial(
  supabase: ReturnType<typeof createAdminClient>,
  profile: {
    id: string;
    user_id: string;
    trial_days_remaining: number;
  }
): Promise<void> {
  try {
    const now = new Date();
    const newExpiryDate = new Date(now);
    newExpiryDate.setDate(newExpiryDate.getDate() + profile.trial_days_remaining);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('profiles')
      .update({
        subscription_plan: 'trial',
        subscription_expires_at: newExpiryDate.toISOString(),
        next_plan: null,
        plan_switch_at: null,
        subscription_cancelled_at: null,
        updated_at: now.toISOString(),
      })
      .eq('id', profile.id);

    logger.info('User returned to trial', {
      userId: profile.user_id,
      daysRemaining: profile.trial_days_remaining,
    });
  } catch (error) {
    logger.error('Failed to return user to trial', {
      profileId: profile.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Disable user account
 */
async function disableUser(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  userEmail: string,
  userName: string | null,
  expiresAt: string | null
): Promise<void> {
  try {
    // Check if disabled notification was already sent
    if (await wasNotificationSent(supabase, userId, 'disabled', expiresAt)) {
      logger.info('User already disabled, notification already sent', { userId });
      return;
    }

    const now = new Date().toISOString();

    // Update profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('profiles')
      .update({
        is_disabled: true,
        updated_at: now,
      })
      .eq('user_id', userId);

    // Send disabled notification
    const sent = await sendAccountDisabledEmail(userEmail, userName);
    if (sent) {
      await markNotificationSent(supabase, userId, 'disabled', expiresAt);
    }

    logger.info('User disabled due to expired subscription', { userId });
  } catch (error) {
    logger.error('Failed to disable user', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

