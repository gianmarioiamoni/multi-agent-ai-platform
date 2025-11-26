/**
 * Preferences Section Component
 * General application preferences
 * Following SRP: Only handles preferences UI
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { UserPreferences } from '@/types/settings.types';

interface PreferencesSectionProps {
  preferences: UserPreferences;
  onUpdate: (preferences: Partial<UserPreferences>) => Promise<void>;
  isSaving: boolean;
}

const AVAILABLE_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];

export const PreferencesSection = ({
  preferences,
  onUpdate,
  isSaving,
}: PreferencesSectionProps) => {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleModelChange = (model: string) => {
    const updated = { ...localPreferences, defaultModel: model };
    setLocalPreferences(updated);
    setHasChanges(
      JSON.stringify(updated) !== JSON.stringify({ ...preferences, defaultModel: preferences.defaultModel })
    );
  };

  const handleAutoSaveToggle = () => {
    const updated = {
      ...localPreferences,
      autoSave: !localPreferences.autoSave,
    };
    setLocalPreferences(updated);
    setHasChanges(JSON.stringify(updated) !== JSON.stringify(preferences));
  };

  const handleSave = async () => {
    await onUpdate(localPreferences);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Set your default preferences for agents and workflows
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Default Model */}
          <div className="space-y-2">
            <Label htmlFor="default-model">Default AI Model</Label>
            <select
              id="default-model"
              value={localPreferences.defaultModel || 'gpt-4o-mini'}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              This model will be used by default when creating new agents
            </p>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save" className="text-base font-medium">
                Auto Save
              </Label>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Automatically save changes to agents and workflows as you work
              </p>
            </div>
            <button
              type="button"
              id="auto-save"
              role="switch"
              aria-checked={localPreferences.autoSave}
              onClick={handleAutoSaveToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                localPreferences.autoSave
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[var(--color-muted)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localPreferences.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {hasChanges && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="primary"
              size="sm"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

