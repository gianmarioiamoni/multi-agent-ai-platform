/**
 * Reset Password Hook
 * Handles password reset logic and state
 * Following SRP: Only manages password reset operations
 */

'use client';

import { useState } from 'react';
import { resetPassword } from '@/lib/auth/actions';
import { useToast } from '@/contexts/toast-context';

interface UseResetPasswordReturn {
  isLoading: boolean;
  emailSent: boolean;
  handleResetPassword: (email: string) => Promise<void>;
}

/**
 * Hook for managing password reset operations
 */
export function useResetPassword(): UseResetPasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { success, error: showError } = useToast();

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setEmailSent(true);
        success(
          'Reset email sent',
          'Please check your email for password reset instructions.'
        );
      } else {
        showError('Failed to send reset email', result.error);
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

  return {
    isLoading,
    emailSent,
    handleResetPassword,
  };
}

