/**
 * OpenAI Tool Config Actions Component
 * Save button and action buttons
 * Following SRP: Only handles action buttons UI
 */

'use client';

import { Button } from '@/components/ui/button';

interface OpenAIToolConfigActionsProps {
  isSaving: boolean;
  onSave: () => Promise<void>;
}

export const OpenAIToolConfigActions = ({
  isSaving,
  onSave,
}: OpenAIToolConfigActionsProps) => {
  return (
    <div className="flex justify-end pt-4">
      <Button onClick={onSave} isLoading={isSaving} disabled={isSaving}>
        Save Configuration
      </Button>
    </div>
  );
};

