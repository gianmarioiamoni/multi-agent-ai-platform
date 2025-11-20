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
  settings: Record<string, unknown> | null;
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

  if (error || !profile) {
    return null;
  }

  return {
    id: profile.id,
    userId: profile.user_id,
    name: profile.name,
    role: profile.role as UserRole,
    settings: profile.settings as Record<string, unknown> | null,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
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

