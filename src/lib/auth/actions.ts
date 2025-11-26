/**
 * Authentication Server Actions
 * Server actions for authentication operations
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isDemoUser } from './demo-user';

export type AuthResponse = {
  success: boolean;
  error?: string;
};

/**
 * Sign up a new user with email and password
 */
export const signUp = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  return { success: true };
};

/**
 * Sign in a user with email and password
 * Checks if user is disabled before allowing sign in
 */
export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // After successful authentication, check if user is disabled
    if (authData.user) {
      // Workaround: Type inference issue with profiles table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('is_disabled')
        .eq('user_id', authData.user.id)
        .single() as { data: { is_disabled?: boolean } | null; error: unknown };

      if (profile?.is_disabled === true) {
        // User is disabled, sign them out immediately
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Your account has been disabled. Please contact an administrator for assistance.',
        };
      }
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/auth/login');
};

/**
 * Sign in with Google OAuth
 * Returns the OAuth URL to redirect to
 */
export const signInWithGoogle = async (): Promise<{ url: string }> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { url: data.url };
};

/**
 * Reset password - send reset email
 */
export const resetPassword = async (email: string): Promise<AuthResponse> => {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return { success: true };
};

/**
 * Update password
 * Prevents demo user from changing password
 */
export const updatePassword = async (
  newPassword: string
): Promise<AuthResponse> => {
  // Check if current user is demo user
  const isDemo = await isDemoUser();

  if (isDemo) {
    return {
      success: false,
      error: 'Password changes are not allowed for the demo account. Please contact support if you need to change your password.',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return { success: true };
};

