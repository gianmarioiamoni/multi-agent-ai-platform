/**
 * Preferences Section Model Select Component
 * Select dropdown for default AI model
 * Following SRP: Only handles model select rendering
 */

'use client';

import { Label } from '@/components/ui/label';
import { AVAILABLE_MODELS } from '@/types/agent.types';

interface PreferencesSectionModelSelectProps {
  value: string;
  onChange: (model: string) => void;
}

export const PreferencesSectionModelSelect = ({
  value,
  onChange,
}: PreferencesSectionModelSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="default-model">Default AI Model</Label>
      <select
        id="default-model"
        value={value || 'gpt-4o-mini'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        {AVAILABLE_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <p className="text-sm text-[var(--color-muted-foreground)]">
        This model will be used by default when creating new agents
      </p>
    </div>
  );
};

