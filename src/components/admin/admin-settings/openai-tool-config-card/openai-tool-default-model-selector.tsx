/**
 * OpenAI Tool Default Model Selector Component
 * Dropdown for selecting default OpenAI model
 * Following SRP: Only handles model selector UI
 */

'use client';

import { Label } from '@/components/ui/label';
import { AVAILABLE_MODELS } from '@/types/agent.types';

interface OpenAIToolDefaultModelSelectorProps {
  defaultModel: string;
  onModelChange: (value: string) => void;
}

export const OpenAIToolDefaultModelSelector = ({
  defaultModel,
  onModelChange,
}: OpenAIToolDefaultModelSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="default_model">Default Model</Label>
      <select
        id="default_model"
        value={defaultModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
      >
        {AVAILABLE_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.description}
          </option>
        ))}
      </select>
    </div>
  );
};

