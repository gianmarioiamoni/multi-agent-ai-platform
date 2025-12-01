/**
 * Sign Up Email Form Component
 * Email/password form fields for sign up
 * Following SRP: Only handles email form UI
 */

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SignUpFormData } from '@/lib/validations/auth';

interface EmailFormProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  isLoading: boolean;
  onSubmit: () => void;
}

export const EmailForm = ({ register, errors, isLoading, onSubmit }: EmailFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            error={errors.name?.message}
            disabled={isLoading}
            {...register('name')}
          />
        </div>

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
            disabled={isLoading}
            {...register('email')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" required>
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            disabled={isLoading}
            {...register('password')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" required>
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            {...register('confirmPassword')}
          />
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </div>
    </form>
  );
};

