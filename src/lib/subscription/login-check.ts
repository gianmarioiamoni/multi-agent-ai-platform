/**
 * Subscription Login Check
 * Safety check for subscription expiry at login time
 * Following SRP: Only handles subscription status verification
 * 
 * This is a safety net that works alongside the cron job:
 * - Cron job: Primary mechanism (notifications, automatic disabling)
 * - Login check: Safety net (immediate verification, prevent access)
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { logInfo, logError } from '@/lib/logging/logger';
import type { SubscriptionPlan } from '@/types/subscription.types';

interface SubscriptionStatus {
  isExpired: boolean;
  daysRemaining: number | null;
  plan: SubscriptionPlan | null;
  expiresAt: string | null;
  shouldDisable: boolean;
  shouldShowWarning: boolean;
}

/**
 * Check subscription status for current user
 * Returns status information for UI display and actions
 */
export async function checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error } = await (supabase as any)
      .from('profiles')
      .select('subscription_plan, subscription_expires_at, is_disabled, role, is_demo')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      logError('Failed to check subscription status', {
        userId,
        error: error?.message,
      });
      return {
        isExpired: false,
        daysRemaining: null,
        plan: null,
        expiresAt: null,
        shouldDisable: false,
        shouldShowWarning: false,
      };
    }

    // Admin and demo users don't have subscription checks
    if (profile.role === 'admin' || profile.is_demo === true) {
      return {
        isExpired: false,
        daysRemaining: null,
        plan: null,
        expiresAt: null,
        shouldDisable: false,
        shouldShowWarning: false,
      };
    }

    const subscriptionPlan = profile.subscription_plan as SubscriptionPlan | null;
    const expiresAt = profile.subscription_expires_at as string | null;
    const isDisabled = profile.is_disabled === true;

    // No subscription (should not happen for regular users, but handle gracefully)
    if (!subscriptionPlan || !expiresAt) {
      return {
        isExpired: true,
        daysRemaining: 0,
        plan: subscriptionPlan,
        expiresAt: null,
        shouldDisable: !isDisabled, // Disable if not already disabled
        shouldShowWarning: false,
      };
    }

    // Calculate days remaining
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isExpired = expiryDate <= now;

    return {
      isExpired,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      plan: subscriptionPlan,
      expiresAt,
      shouldDisable: isExpired && !isDisabled, // Disable if expired and not already disabled
      shouldShowWarning: !isExpired && daysRemaining <= 7 && daysRemaining > 0, // Warn if 7 days or less remaining
    };
  } catch (error) {
    logError('Error checking subscription status', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      isExpired: false,
      daysRemaining: null,
      plan: null,
      expiresAt: null,
      shouldDisable: false,
      shouldShowWarning: false,
    };
  }
}

/**
 * Disable user if subscription expired (safety net)
 * This is called at login time as a backup to the cron job
 */
export async function disableExpiredUser(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        is_disabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('is_disabled', false); // Only update if not already disabled

    if (error) {
      logError('Failed to disable expired user at login', {
        userId,
        error: error.message,
      });
      return false;
    }

    logInfo('Expired user disabled at login (safety net)', { userId });
    return true;
  } catch (error) {
    logError('Error disabling expired user at login', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

