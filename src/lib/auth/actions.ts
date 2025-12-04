/**
 * Authentication Server Actions
 * Server actions for authentication operations
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isDemoUser } from './demo-user';
import { validateCsrfToken } from '@/lib/security/csrf';
import { logCsrfMismatchFromAction } from '@/lib/security/security-logger';
import { getAppUrl } from '@/utils/url';

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
  name?: string,
  csrfToken?: string
): Promise<AuthResponse> => {
  // Validate CSRF token
  if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
    await logCsrfMismatchFromAction('/auth/register');
    return {
      success: false,
      error: 'Invalid security token. Please refresh the page and try again.',
    };
  }

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
  password: string,
  csrfToken?: string
): Promise<AuthResponse> => {
  // Validate CSRF token
  if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
    await logCsrfMismatchFromAction('/auth/login');
    return {
      success: false,
      error: 'Invalid security token. Please refresh the page and try again.',
    };
  }

  try {
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log failed login attempt
      const { logSecurityEvent, extractClientInfo } = await import('@/lib/security/security-logger');
      // Create a minimal request object for logging
      const mockRequest = {
        nextUrl: { pathname: '/auth/login' },
        method: 'POST',
        headers: new Headers(),
      } as Parameters<typeof extractClientInfo>[0];
      
      const { ipAddress, userAgent } = extractClientInfo(mockRequest);
      await logSecurityEvent({
        type: 'failed_login',
        ipAddress,
        userAgent,
        path: '/auth/login',
        method: 'POST',
        details: {
          email: email ? email.substring(0, 3) + '***' : undefined,
          reason: error.message,
        },
      });
      
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
        .select('is_disabled, role, is_demo')
        .eq('user_id', authData.user.id)
        .single() as { data: { is_disabled?: boolean; role?: string; is_demo?: boolean } | null; error: unknown };

      if (profile?.is_disabled === true) {
        // User is disabled, sign them out immediately
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Your account has been disabled. Please contact an administrator for assistance.',
        };
      }

      // Safety check: Verify subscription status at login (backup to cron job)
      // Skip check for admin and demo users
      if (profile?.role !== 'admin' && profile?.is_demo !== true) {
        const { checkSubscriptionStatus, disableExpiredUser } = await import('@/lib/subscription/login-check');
        const subscriptionStatus = await checkSubscriptionStatus(authData.user.id);

        // Disable user if subscription expired (safety net - cron should handle this, but check here too)
        if (subscriptionStatus.shouldDisable) {
          await disableExpiredUser(authData.user.id);
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Your subscription has expired. Please subscribe to continue using the platform.',
          };
        }
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
      redirectTo: `${getAppUrl()}/auth/callback`,
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
export const resetPassword = async (
  email: string,
  csrfToken?: string
): Promise<AuthResponse> => {
  // CSRF token is optional for password reset (can be called without auth)
  // But if provided, validate it
  if (csrfToken && !(await validateCsrfToken(csrfToken))) {
    await logCsrfMismatchFromAction('/auth/reset-password');
    return {
      success: false,
      error: 'Invalid security token. Please refresh the page and try again.',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}/auth/reset-password`,
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
  newPassword: string,
  csrfToken?: string
): Promise<AuthResponse> => {
  // Validate CSRF token
  if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
    const { getCurrentUser } = await import('./utils');
    const user = await getCurrentUser();
    await logCsrfMismatchFromAction('/app/account', user?.id);
    return {
      success: false,
      error: 'Invalid security token. Please refresh the page and try again.',
    };
  }

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

