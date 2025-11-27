/**
 * Preferences Section Actions Component
 * Save button for preferences
 * Following SRP: Only handles actions rendering
 */

'use client';

import { Button } from '@/components/ui/button';

interface PreferencesSectionActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => Promise<void>;
}

export const PreferencesSectionActions = ({
  hasChanges,
  isSaving,
  onSave,
}: PreferencesSectionActionsProps) => {
  if (!hasChanges) {
    return null;
  }

  return (
    <div className="flex justify-end pt-2">
      <Button onClick={onSave} disabled={isSaving} variant="primary" size="sm">
        {isSaving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  );
};

