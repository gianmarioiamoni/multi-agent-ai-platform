/**
 * User Role Management Hook
 * Handles role update logic and state
 * Following SRP: Only manages role changes
 */

'use client';

import { useState } from 'react';
import { updateUserRole } from '@/lib/admin/actions';
import { useToast } from '@/contexts/toast-context';
import type { Database } from '@/types/database.types';

type UserRole = Database['public']['Enums']['user_role'];

interface UseUserRoleManagementReturn {
  isUpdating: string | null;
  updateRole: (userId: string, newRole: UserRole) => Promise<void>;
}

/**
 * Hook for managing user role updates
 */
export function useUserRoleManagement(): UseUserRoleManagementReturn {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const updateRole = async (userId: string, newRole: UserRole) => {
    setIsUpdating(userId);

    try {
      const result = await updateUserRole(userId, newRole);

      if (result.success) {
        success('Role updated', 'User role has been updated successfully');
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
    updateRole,
  };
}

