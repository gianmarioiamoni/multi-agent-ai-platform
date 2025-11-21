/**
 * Admin Server Actions
 * Actions for admin operations (user management, etc.)
 * Following SRP: Each action handles one specific admin task
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/admin';
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

  const supabase = createClient();
  
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

    const supabase = createClient();

    // Prevent changing own role
    const currentProfile = await getCurrentUserProfile();
    if (currentProfile?.userId === userId) {
      return {
        success: false,
        error: 'Cannot change your own role',
      };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
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
 * Get platform statistics
 */
export async function getPlatformStats() {
  await ensureAdmin();

  const supabase = createClient();

  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Get users by role
  const { data: roles } = await supabase
    .from('profiles')
    .select('role');

  const roleStats = {
    admin: roles?.filter(r => r.role === 'admin').length || 0,
    user: roles?.filter(r => r.role === 'user').length || 0,
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

