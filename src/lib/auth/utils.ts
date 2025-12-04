/**
 * Authentication Utilities
 * Helper functions for authentication and authorization
 */

import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  userId: string;
  name: string | null;
  role: UserRole;
  isDemo: boolean;
  isDisabled: boolean;
  settings: Record<string, unknown> | null;
  subscriptionPlan: 'trial' | 'basic' | 'premium' | null;
  subscriptionExpiresAt: string | null;
  trialUsed: boolean;
  trialDaysRemaining: number;
  nextPlan: 'trial' | 'basic' | 'premium' | null;
  planSwitchAt: string | null;
  subscriptionCancelledAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get the current authenticated user
 * @returns User object or null if not authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

/**
 * Get the current user's profile with role
 * @returns UserProfile or null if not authenticated
 */
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('getCurrentUserProfile: Error fetching profile:', error);
    return null;
  }

  if (!profile) {
    return null;
  }

  // Type assertion for database row
  const profileData = profile as {
    id: string;
    user_id: string;
    name: string | null;
    role: string;
    is_demo: boolean;
    is_disabled: boolean;
    settings: Record<string, unknown> | null;
    subscription_plan: 'trial' | 'basic' | 'premium' | null;
    subscription_expires_at: string | null;
    trial_used: boolean;
    trial_days_remaining: number | null;
    next_plan: 'trial' | 'basic' | 'premium' | null;
    plan_switch_at: string | null;
    subscription_cancelled_at: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    stripe_price_id: string | null;
    created_at: string;
    updated_at: string;
  };

  return {
    id: profileData.id,
    userId: profileData.user_id,
    name: profileData.name,
    role: profileData.role as UserRole,
    isDemo: profileData.is_demo === true,
    isDisabled: profileData.is_disabled === true,
    settings: profileData.settings,
    subscriptionPlan: profileData.subscription_plan || null,
    subscriptionExpiresAt: profileData.subscription_expires_at || null,
    trialUsed: profileData.trial_used === true,
    trialDaysRemaining: profileData.trial_days_remaining ?? 0,
    nextPlan: profileData.next_plan || null,
    planSwitchAt: profileData.plan_switch_at || null,
    subscriptionCancelledAt: profileData.subscription_cancelled_at || null,
    stripeCustomerId: profileData.stripe_customer_id || null,
    stripeSubscriptionId: profileData.stripe_subscription_id || null,
    stripePriceId: profileData.stripe_price_id || null,
    createdAt: profileData.created_at,
    updatedAt: profileData.updated_at,
  };
};

/**
 * Check if the current user is an admin
 * @returns true if user is admin, false otherwise
 */
export const isAdmin = async (): Promise<boolean> => {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin';
};

/**
 * Check if the current user is authenticated
 * @returns true if authenticated, false otherwise
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

/**
 * Require authentication for a page
 * Throws error if user is not authenticated
 * Use this in server components that require auth
 */
export const requireAuth = async (): Promise<User> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

/**
 * Require admin role for a page
 * Throws error if user is not admin
 * Use this in server components that require admin access
 */
export const requireAdmin = async (): Promise<UserProfile> => {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    throw new Error('Authentication required');
  }
  if (profile.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return profile;
};

