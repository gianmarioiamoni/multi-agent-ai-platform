/**
 * Form Actions Component
 * Save and Cancel buttons for workflow builder
 * Following SRP: Only handles action buttons rendering
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AutoSaveIndicator } from '@/components/shared/auto-save-indicator';
import type { AutoSaveStatus } from '@/hooks/shared/use-auto-save';

interface FormActionsProps {
  isLoading: boolean;
  isEditMode?: boolean;
  autoSaveStatus?: AutoSaveStatus;
  autoSaveLastSaved?: Date | null;
}

export const FormActions = ({ 
  isLoading, 
  isEditMode = false,
  autoSaveStatus,
  autoSaveLastSaved,
}: FormActionsProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t">
      {/* Auto-save indicator (left side, only in edit mode) */}
      <div>
        {isEditMode && autoSaveStatus ? <AutoSaveIndicator 
            status={autoSaveStatus} 
            lastSavedAt={autoSaveLastSaved || null}
          /> : null}
      </div>

      {/* Action buttons (right side) */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading 
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Workflow' : 'Create Workflow')
          }
        </Button>
      </div>
    </div>
  );
};

