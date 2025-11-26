/**
 * Profile Form Component
 * Form for updating user profile information
 * Following SRP: Only handles form composition
 */

'use client';

import { useProfileUpdate } from '@/hooks/profile/use-profile-update';
import { NameField } from './profile-form/name-field';
import { UnsavedChangesAlert } from './profile-form/unsaved-changes-alert';
import { FormActions } from './profile-form/form-actions';

interface ProfileFormProps {
  initialName: string;
}

export const ProfileForm = ({ initialName }: ProfileFormProps) => {
  const {
    name,
    isSubmitting,
    hasChanges,
    setName,
    handleSubmit,
    handleReset,
  } = useProfileUpdate(initialName);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <NameField
        value={name}
        onChange={setName}
        disabled={isSubmitting}
      />

      <UnsavedChangesAlert show={hasChanges} />

      <FormActions
        hasChanges={hasChanges}
        isSubmitting={isSubmitting}
        onReset={handleReset}
      />
    </form>
  );
};

