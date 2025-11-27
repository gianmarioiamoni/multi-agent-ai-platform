/**
 * Web Search Tool Config Actions Component
 * Save button and action buttons
 * Following SRP: Only handles action buttons UI
 */

'use client';

import { Button } from '@/components/ui/button';

interface WebSearchToolConfigActionsProps {
  isSaving: boolean;
  onSave: () => Promise<void>;
}

export const WebSearchToolConfigActions = ({
  isSaving,
  onSave,
}: WebSearchToolConfigActionsProps) => {
  return (
    <div className="flex justify-end pt-4">
      <Button onClick={onSave} isLoading={isSaving} disabled={isSaving}>
        Save Configuration
      </Button>
    </div>
  );
};

