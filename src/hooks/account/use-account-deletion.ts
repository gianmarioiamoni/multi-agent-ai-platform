/**
 * Account Deletion Hook
 * Handles account deletion logic
 * Following SRP: Only handles account deletion logic
 */

'use client';

import { useState } from 'react';
import { deleteAccount } from '@/lib/auth/account-deletion';
import { useToast } from '@/contexts/toast-context';

export const useAccountDeletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { error: showError } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteAccount();

      if (!result.success) {
        showError('Account deletion failed', result.error || 'Failed to delete account');
        setIsLoading(false);
        setIsDialogOpen(false);
      }
      // If successful, deleteAccount will redirect, so we don't need to handle it here
    } catch (err) {
      showError('Account deletion failed', err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  return {
    isLoading,
    isDialogOpen,
    openDialog: () => setIsDialogOpen(true),
    closeDialog: () => setIsDialogOpen(false),
    handleDelete,
  };
};

