/**
 * Demo Flag Management Hook
 * Handles demo flag update logic and state
 * Following SRP: Only manages demo flag changes
 */

'use client';

import { useState } from 'react';
import { updateUserDemoFlag } from '@/lib/admin/actions';
import { useToast } from '@/contexts/toast-context';

interface UseDemoFlagManagementReturn {
  isUpdating: string | null;
  updateDemoFlag: (userId: string, isDemo: boolean) => Promise<void>;
}

/**
 * Hook for managing user demo flag updates
 */
export function useDemoFlagManagement(): UseDemoFlagManagementReturn {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const updateDemoFlag = async (userId: string, isDemo: boolean) => {
    setIsUpdating(userId);

    try {
      const result = await updateUserDemoFlag(userId, isDemo);

      if (result.success) {
        success(
          'Demo flag updated',
          isDemo
            ? 'User has been marked as demo account'
            : 'Demo flag has been removed from user'
        );
      } else {
        showError('Update failed', result.error || 'Unknown error');
      }
    } catch (_err) {
      showError('Update failed', 'An unexpected error occurred');
    } finally {
      setIsUpdating(null);
    }
  };

  return {
    isUpdating,
    updateDemoFlag,
  };
}

