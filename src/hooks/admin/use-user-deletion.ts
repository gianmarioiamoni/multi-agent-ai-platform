/**
 * User Deletion Hook
 * Manages user deletion logic
 * Following SRP: Only handles user deletion
 */

'use client';

import { useState } from 'react';
import { deleteUser } from '@/lib/admin/actions';
import { useToast } from '@/contexts/toast-context';

interface UseUserDeletionReturn {
  isDeleting: string | null;
  deleteUserAccount: (userId: string) => Promise<void>;
}

/**
 * Hook for managing user deletion
 */
export function useUserDeletion(): UseUserDeletionReturn {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const deleteUserAccount = async (userId: string) => {
    setIsDeleting(userId);

    try {
      const result = await deleteUser(userId);

      if (result.success) {
        success('User deleted', 'The user account has been permanently deleted');
      } else {
        showError('Failed to delete user', result.error);
      }
    } catch (err) {
      showError(
        'An error occurred',
        err instanceof Error ? err.message : 'Please try again later.'
      );
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    isDeleting,
    deleteUserAccount,
  };
}

