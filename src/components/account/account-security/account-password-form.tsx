/**
 * Account Password Form Component
 * Form for changing user password
 * Following SRP: Only handles password form UI
 */

'use client';

import { usePasswordChange } from '@/hooks/account/use-password-change';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';

interface AccountPasswordFormProps {
  isDemo: boolean;
}

export const AccountPasswordForm = ({ isDemo }: AccountPasswordFormProps) => {
  const { form, isLoading, onSubmit } = usePasswordChange();
  const {
    control,
    formState: { errors },
  } = form;

  if (isDemo) {
    return (
      <div>
        <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-2">
          Change Password
        </h3>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
          Password changes are not allowed for demo accounts.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-4">
        Change Password
      </h3>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                error={errors.newPassword?.message}
                disabled={isLoading}
                fullWidth
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                error={errors.confirmPassword?.message}
                disabled={isLoading}
                fullWidth
              />
            )}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

