/**
 * Sign In Email Form Component
 * Email/password form fields for sign in
 * Following SRP: Only handles email form UI
 */

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SignInFormData } from '@/lib/validations/auth';

interface EmailFormProps {
  register: UseFormRegister<SignInFormData>;
  errors: FieldErrors<SignInFormData>;
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
}

export const EmailForm = ({ 
  register, 
  errors, 
  isLoading, 
  isDisabled, 
  onSubmit 
}: EmailFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          error={errors.email?.message}
          disabled={isDisabled}
          {...register('email')}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" required>
            Password
          </Label>
          <Link
            href="/auth/reset-password"
            className="text-sm text-primary hover:underline"
            tabIndex={isDisabled ? -1 : 0}
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isDisabled}
          {...register('password')}
        />
      </div>

      <Button type="submit" fullWidth isLoading={isLoading} disabled={isDisabled}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

