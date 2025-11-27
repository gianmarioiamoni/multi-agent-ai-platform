/**
 * Notifications Section Actions Component
 * Save button for notification preferences
 * Following SRP: Only handles actions rendering
 */

'use client';

import { Button } from '@/components/ui/button';

interface NotificationsSectionActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => Promise<void>;
}

export const NotificationsSectionActions = ({
  hasChanges,
  isSaving,
  onSave,
}: NotificationsSectionActionsProps) => {
  if (!hasChanges) {
    return null;
  }

  return (
    <div className="flex justify-end pt-2">
      <Button onClick={onSave} disabled={isSaving} variant="primary" size="sm">
        {isSaving ? 'Saving...' : 'Save Notifications'}
      </Button>
    </div>
  );
};

