/**
 * Form Actions Component
 * Save and Cancel buttons for workflow builder
 * Following SRP: Only handles action buttons rendering
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isLoading: boolean;
}

export const FormActions = ({ isLoading }: FormActionsProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-4 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button type="submit" variant="primary" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Workflow'}
      </Button>
    </div>
  );
};

