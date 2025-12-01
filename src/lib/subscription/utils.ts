/**
 * Subscription Utilities
 * Helper functions for subscription management
 * Following SRP: Only utility functions for subscription logic
 */

import type { UserSubscription, SubscriptionPlan } from '@/types/subscription.types';

/**
 * Calculate days remaining until subscription expires
 */
export const calculateDaysRemaining = (expiresAt: string | null): number | null => {
  if (!expiresAt) {return null;}
  
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Check if subscription is active
 */
export const isSubscriptionActive = (
  plan: SubscriptionPlan | null,
  expiresAt: string | null
): boolean => {
  if (!plan || !expiresAt) {return false;}
  
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  
  return expiryDate > now;
};

/**
 * Format subscription expiry date
 */
export const formatExpiryDate = (expiresAt: string | null): string | null => {
  if (!expiresAt) {return null;}
  
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(expiresAt));
};

/**
 * Get user subscription info
 */
export const getUserSubscription = (
  plan: SubscriptionPlan | null,
  expiresAt: string | null
): UserSubscription => {
  const daysRemaining = calculateDaysRemaining(expiresAt);
  const isActive = isSubscriptionActive(plan, expiresAt);
  
  return {
    plan,
    expiresAt,
    isActive,
    isTrial: plan === 'trial',
    daysRemaining,
  };
};

/**
 * Get subscription plan display name
 */
export const getPlanDisplayName = (plan: SubscriptionPlan | null): string => {
  switch (plan) {
    case 'trial':
      return 'Trial';
    case 'basic':
      return 'Basic';
    case 'premium':
      return 'Premium';
    default:
      return 'No Plan';
  }
};

/**
 * Check if user can activate trial
 */
export const canActivateTrial = (
  plan: SubscriptionPlan | null,
  trialUsed: boolean
): boolean => {
  // User already has a plan or has used trial
  if (plan || trialUsed) {return false;}
  return true;
};

/**
 * Check if user can select a plan (not admin, not demo)
 */
export const canSelectPlan = (role: string, isDemo: boolean): boolean => {
  // Admins have unlimited access, no plan needed
  if (role === 'admin') {return false;}
  // Demo users cannot change plans
  if (isDemo) {return false;}
  return true;
};
