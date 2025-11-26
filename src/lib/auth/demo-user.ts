/**
 * Demo User Utilities
 * Utilities to identify and protect the demo user account
 * Following SRP: Only handles demo user identification
 */

import { getCurrentUserProfile } from './utils';

/**
 * Check if the current user is the demo user
 * The demo user is identified by the is_demo flag in the profiles table
 * @returns true if current user is demo user, false otherwise
 */
export async function isDemoUser(): Promise<boolean> {
  try {
    const profile = await getCurrentUserProfile();
    
    if (!profile) {
      return false;
    }

    // isDemo is already included in UserProfile from getCurrentUserProfile
    return profile.isDemo === true;
  } catch (error) {
    // If anything goes wrong, assume user is not demo
    console.error('Error checking if user is demo:', error);
    return false;
  }
}

/**
 * Server action to check if current user is demo user
 * Safe to call from client components
 */
export async function checkIsDemoUser(): Promise<boolean> {
  'use server';
  return await isDemoUser();
}

