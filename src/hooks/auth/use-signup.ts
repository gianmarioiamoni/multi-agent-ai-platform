/**
 * Sign Up Hook
 * Handles sign up logic and state
 * Following SRP: Only manages sign up operations
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth/actions';
import { useToast } from '@/contexts/toast-context';

interface UseSignUpReturn {
  isLoading: boolean;
  handleSignUp: (email: string, password: string, name: string) => Promise<void>;
}

/**
 * Hook for managing sign up operations
 */
export function useSignUp(): UseSignUpReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToast();

  const handleSignUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    try {
      const result = await signUp(email, password, name);

      if (result.success) {
        success(
          'Account created successfully!',
          'Please check your email to verify your account before signing in.'
        );
        // Wait before redirecting
        setTimeout(() => {
          router.push('/auth/login?verified=false');
        }, 2500);
      } else {
        showError('Sign up failed', result.error);
      }
    } catch (err) {
      showError(
        'An error occurred',
        err instanceof Error ? err.message : 'Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignUp,
  };
}

