/**
 * Profile Form Component
 * Form for updating user profile information
 * Following SRP: Only handles profile form UI and submission
 */

'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/profile/actions';
import { useToast } from '@/contexts/toast-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileFormProps {
  initialName: string;
}

export const ProfileForm = ({ initialName }: ProfileFormProps) => {
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
    } catch (err) {
      showError('Update failed', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName(initialName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" required>
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-[var(--color-muted-foreground)]">
          This is the name that will be displayed throughout the platform
        </p>
      </div>

      {hasChanges && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
          <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-[var(--color-foreground)]">
            You have unsaved changes
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={!hasChanges || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>

        {hasChanges && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
};

