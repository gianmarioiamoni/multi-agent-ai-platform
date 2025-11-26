/**
 * Disabled Status Management Hook
 * Manages disabled status toggle logic for users
 * Following SRP: Only handles disabled status management
 */

'use client';

import { useState } from 'react';
import { updateUserDisabledStatus } from '@/lib/admin/actions';
import { useToast } from '@/contexts/toast-context';

interface UseDisabledStatusManagementReturn {
  isUpdating: string | null;
  toggleDisabledStatus: (userId: string, currentStatus: boolean) => Promise<void>;
}

/**
 * Hook for managing user disabled status
 */
export function useDisabledStatusManagement(): UseDisabledStatusManagementReturn {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const toggleDisabledStatus = async (userId: string, currentStatus: boolean) => {
    setIsUpdating(userId);

    try {
      const result = await updateUserDisabledStatus(userId, !currentStatus);

      if (result.success) {
        success(
          'Status updated',
          `User account has been ${!currentStatus ? 'disabled' : 'enabled'}`
        );
      } else {
        showError('Failed to update status', result.error);
      }
    } catch (err) {
      showError(
        'An error occurred',
        err instanceof Error ? err.message : 'Please try again later.'
      );
    } finally {
      setIsUpdating(null);
    }
  };

  return {
    isUpdating,
    toggleDisabledStatus,
  };
}

