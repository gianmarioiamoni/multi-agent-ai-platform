/**
 * Account Deletion Actions
 * Server actions for account deletion
 * Prevents demo user from deleting account
 * Following SRP: Only handles account deletion logic
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isDemoUser } from './demo-user';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type AccountDeletionResponse = {
  success: boolean;
  error?: string;
};

/**
 * Delete the current user's account
 * Prevents demo user from deleting account
 * @returns AccountDeletionResponse
 */
export async function deleteAccount(): Promise<AccountDeletionResponse> {
  // Check if current user is demo user
  const isDemo = await isDemoUser();

  if (isDemo) {
    return {
      success: false,
      error: 'Account deletion is not allowed for the demo account. Please contact support if you need to delete your account.',
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Use admin client to delete user (this will cascade delete profile and other data)
    const adminClient = createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message,
      };
    }

    // Sign out and redirect to login
    revalidatePath('/', 'layout');
    redirect('/auth/login');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

