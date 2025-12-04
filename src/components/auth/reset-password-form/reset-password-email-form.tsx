/**
 * Reset Password Email Form Component
 * Email input form for password reset request
 * Following SRP: Only handles email form UI
 */

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ResetPasswordFormData } from '@/lib/validations/auth';

interface ResetPasswordEmailFormProps {
  register: UseFormRegister<ResetPasswordFormData>;
  errors: FieldErrors<ResetPasswordFormData>;
  isLoading: boolean;
  onSubmit: () => void;
}

export const ResetPasswordEmailForm = ({
  register,
  errors,
  isLoading,
  onSubmit,
}: ResetPasswordEmailFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" required>
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
};

