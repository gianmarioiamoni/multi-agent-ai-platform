/**
 * Logout Hook
 * Handles logout logic and state
 * Following SRP: Only manages logout operations
 */

'use client';

import { useState } from 'react';
import { signOut } from '@/lib/auth/actions';
import { useToast } from '@/contexts/toast-context';

interface UseLogoutReturn {
  isLoggingOut: boolean;
  handleLogout: () => Promise<void>;
}

/**
 * Hook for managing logout operations
 */
export function useLogout(): UseLogoutReturn {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { error: showError } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await signOut();
    } catch (err) {
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        throw err;
      }
      showError('Logout failed', 'Please try again');
      setIsLoggingOut(false);
    }
  };

  return {
    isLoggingOut,
    handleLogout,
  };
}

