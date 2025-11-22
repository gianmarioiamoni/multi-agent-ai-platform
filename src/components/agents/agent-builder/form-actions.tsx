/**
 * Form Actions Component
 * Submit and cancel buttons for agent builder
 * Following SRP: Only handles form action buttons
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isLoading: boolean;
}

export const FormActions = ({ isLoading }: FormActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-4">
      <Link href="/app/agents">
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
            Creating...
          </>
        ) : (
          'Create Agent'
        )}
      </Button>
    </div>
  );
};

