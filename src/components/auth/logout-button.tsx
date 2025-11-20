/**
 * Logout Button Component
 * Button to sign out the current user
 * Following SRP: Only handles logout UI and interaction
 */

'use client';

import { useState } from 'react';
import { signOut } from '@/lib/auth/actions';
import { useToast } from '@/contexts/toast-context';
import { Button } from '@/components/ui/button';

export const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useToast();

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await signOut();
      // signOut will redirect to login page
    } catch (err) {
      showError(
        'Logout failed',
        err instanceof Error ? err.message : 'Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="md"
      onClick={handleLogout}
      isLoading={isLoading}
      disabled={isLoading}
    >
      {isLoading ? (
        'Signing out...'
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </>
      )}
    </Button>
  );
};

