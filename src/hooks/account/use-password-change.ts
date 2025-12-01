/**
 * Password Change Hook
 * Handles password change logic
 * Following SRP: Only handles password change logic
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword } from '@/lib/auth/actions';
import { updatePasswordSchema, type UpdatePasswordFormData } from '@/lib/validations/auth';
import { useToast } from '@/contexts/toast-context';

interface UsePasswordChangeProps {
  csrfToken: string;
}

export const usePasswordChange = ({ csrfToken }: UsePasswordChangeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToast();

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    try {
      const result = await updatePassword(data.newPassword, csrfToken);

      if (result.success) {
        success('Password updated', 'Your password has been successfully updated.');
        form.reset();
      } else {
        showError('Password update failed', result.error || 'Failed to update password');
      }
    } catch (err) {
      showError('Password update failed', err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

