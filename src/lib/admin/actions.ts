/**
 * Admin Server Actions
 * Actions for admin operations (user management, etc.)
 * Following SRP: Each action handles one specific admin task
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import type { Database } from '@/types/database.types';

type UserRole = Database['public']['Enums']['user_role'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Ensure current user is admin
 */
async function ensureAdmin(): Promise<void> {
  const profile = await getCurrentUserProfile();
  
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
}

/**
 * Get all users with their profiles
 */
export async function getAllUsers(): Promise<Profile[]> {
  await ensureAdmin();

  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data || [];
}

/**
 * Update user role
 */
export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<ActionResult> {
  try {
    await ensureAdmin();

    const supabase = createAdminClient();

    // Prevent changing own role
    const currentProfile = await getCurrentUserProfile();
    if (currentProfile?.userId === userId) {
      return {
        success: false,
        error: 'Cannot change your own role',
      };
    }

    const updateData = { role: newRole };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any)
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      return {
        success: false,
        error: `Failed to update role: ${error.message}`,
      };
    }

    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update user demo flag
 */
export async function updateUserDemoFlag(
  userId: string,
  isDemo: boolean
): Promise<ActionResult> {
  try {
    await ensureAdmin();

    const supabase = createAdminClient();

    // Prevent changing own demo flag
    const currentProfile = await getCurrentUserProfile();
    if (currentProfile?.userId === userId) {
      return {
        success: false,
        error: 'Cannot change your own demo status',
      };
    }

    const updateData = { is_demo: isDemo };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any)
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      return {
        success: false,
        error: `Failed to update demo flag: ${error.message}`,
      };
    }

    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update user disabled status
 */
export async function updateUserDisabledStatus(
  userId: string,
  isDisabled: boolean
): Promise<ActionResult> {
  try {
    await ensureAdmin();

    const supabase = createAdminClient();

    // Prevent disabling own account
    const currentProfile = await getCurrentUserProfile();
    if (currentProfile?.userId === userId) {
      return {
        success: false,
        error: 'Cannot disable your own account',
      };
    }

    const updateData = { is_disabled: isDisabled };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any)
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      return {
        success: false,
        error: `Failed to update disabled status: ${error.message}`,
      };
    }

    // If disabling user, sign them out by revoking their session
    if (isDisabled) {
      // Use admin client to sign out the user from all sessions
      const { error: signOutError } = await supabase.auth.admin.signOut(userId, 'global');
      if (signOutError) {
        // Log but don't fail - the user is already disabled in the database
        console.error('Failed to sign out disabled user:', signOutError);
      }
    }

    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete user account
 * This will:
 * 1. Delete the user's profile
 * 2. Delete the auth user (cascades to related data)
 */
export async function deleteUser(userId: string): Promise<ActionResult> {
  try {
    await ensureAdmin();

    const supabase = createAdminClient();

    // Prevent deleting own account
    const currentProfile = await getCurrentUserProfile();
    if (currentProfile?.userId === userId) {
      return {
        success: false,
        error: 'Cannot delete your own account',
      };
    }

    // First, get user email for confirmation message
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Delete the auth user (this will cascade to profile and other related data)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete user: ${deleteError.message}`,
      };
    }

    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get platform statistics
 */
export async function getPlatformStats() {
  await ensureAdmin();

  const supabase = createAdminClient();

  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Get users by role
  const { data: roles } = await supabase
    .from('profiles')
    .select('role');

  const roleStats = {
    admin: (roles as Array<{ role: 'user' | 'admin' }> | null)?.filter(r => r.role === 'admin').length || 0,
    user: (roles as Array<{ role: 'user' | 'admin' }> | null)?.filter(r => r.role === 'user').length || 0,
  };

  // Get recent users (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString());

  return {
    totalUsers: totalUsers || 0,
    recentUsers: recentUsers || 0,
    roleStats,
  };
}

