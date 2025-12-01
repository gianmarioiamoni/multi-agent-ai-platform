/**
 * Profile Update Hook
 * Handles profile update logic and state
 * Following SRP: Only manages profile update operations
 */

'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/profile/actions';
import { useToast } from '@/contexts/toast-context';

interface UseProfileUpdateReturn {
  name: string;
  isSubmitting: boolean;
  hasChanges: boolean;
  setName: (name: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleReset: () => void;
}

/**
 * Hook for managing profile update operations
 */
export function useProfileUpdate(initialName: string): UseProfileUpdateReturn {
  const [name, setName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError } = useToast();

  const hasChanges = name !== initialName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateProfile({ name });

      if (result.success) {
        success('Profile updated', 'Your profile has been updated successfully');
      } else {
        showError('Update failed', result.error || 'Unknown error');
      }
    } catch (_err) {
      showError('Update failed', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName(initialName);
  };

  return {
    name,
    isSubmitting,
    hasChanges,
    setName,
    handleSubmit,
    handleReset,
  };
}

