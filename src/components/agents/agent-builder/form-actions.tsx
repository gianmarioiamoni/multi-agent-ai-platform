/**
 * Form Actions Component
 * Submit and cancel buttons for agent builder
 * Following SRP: Only handles form action buttons
 */

'use client';

import Link from 'next/link';
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
  return (
    <div className="flex items-center justify-between pt-4">
      {/* Auto-save indicator (left side, only in edit mode) */}
      <div>
        {isEditMode && autoSaveStatus && (
          <AutoSaveIndicator 
            status={autoSaveStatus} 
            lastSavedAt={autoSaveLastSaved || null}
          />
        )}
      </div>

      {/* Action buttons (right side) */}
      <div className="flex items-center gap-3">
        <Link href={isEditMode ? `/app/agents` : '/app/agents'}>
          <Button variant="outline" size="md" type="button" disabled={isLoading}>
            Cancel
          </Button>
        </Link>
        
        <Button variant="primary" size="md" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditMode ? 'Update Agent' : 'Create Agent'
          )}
        </Button>
      </div>
    </div>
  );
};

