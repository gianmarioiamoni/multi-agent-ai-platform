/**
 * Sign In Hook
 * Handles sign in logic and state
 * Following SRP: Only manages sign in operations
 */

'use client';

import { useState } from 'react';
import { signIn, signInWithGoogle } from '@/lib/auth/actions';
import { useToast } from '@/contexts/toast-context';

interface UseSignInReturn {
  isLoading: boolean;
  isGoogleLoading: boolean;
  handleEmailSignIn: (email: string, password: string) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
}

/**
 * Hook for managing sign in operations
 */
export function useSignIn(): UseSignInReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { error: showError } = useToast();

  const handleEmailSignIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        // Successful login - wait for cookies to be set, then redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.href = '/app/dashboard';
      } else {
        // Check if error is about email confirmation
        if (result.error?.toLowerCase().includes('email') && 
            result.error?.toLowerCase().includes('confirm')) {
          showError(
            'Email not verified',
            'Please check your email and click the verification link before signing in.'
          );
        } else {
          showError('Sign in failed', result.error);
        }
        setIsLoading(false);
      }
    } catch (err) {
      showError(
        'An error occurred',
        err instanceof Error ? err.message : 'Please try again later.'
      );
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const { url } = await signInWithGoogle();
      window.location.href = url;
    } catch (err) {
      showError(
        'Google sign in failed',
        err instanceof Error ? err.message : 'Please try again later.'
      );
      setIsGoogleLoading(false);
    }
  };

  return {
    isLoading,
    isGoogleLoading,
    handleEmailSignIn,
    handleGoogleSignIn,
  };
}

