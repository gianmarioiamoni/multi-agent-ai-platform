/**
 * Form Actions Component
 * Save and Reset buttons for form
 * Following SRP: Only handles action buttons UI
 */

import { Button } from '@/components/ui/button';

interface FormActionsProps {
  hasChanges: boolean;
  isSubmitting: boolean;
  onReset: () => void;
}

export const FormActions = ({ hasChanges, isSubmitting, onReset }: FormActionsProps) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        type="submit"
        variant="primary"
        disabled={!hasChanges || isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>

      {hasChanges ? <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isSubmitting}
        >
          Reset
        </Button> : null}
    </div>
  );
};

