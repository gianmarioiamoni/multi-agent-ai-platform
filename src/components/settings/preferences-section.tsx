/**
 * Preferences Section Component
 * Main composition component for user preferences
 * Following SRP: Only handles component composition
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { UserPreferences } from '@/types/settings.types';
import { usePreferencesSection } from '@/hooks/settings/use-preferences-section';
import { PreferencesSectionHeader } from './preferences-section/preferences-section-header';
import { PreferencesSectionModelSelect } from './preferences-section/preferences-section-model-select';
import { PreferencesSectionAutoSaveToggle } from './preferences-section/preferences-section-auto-save-toggle';
import { PreferencesSectionActions } from './preferences-section/preferences-section-actions';

interface PreferencesSectionProps {
  preferences: UserPreferences;
  onUpdate: (preferences: Partial<UserPreferences>) => Promise<void>;
  isSaving: boolean;
}

export const PreferencesSection = ({
  preferences,
  onUpdate,
  isSaving,
}: PreferencesSectionProps) => {
  const {
    localPreferences,
    hasChanges,
    handleModelChange,
    handleAutoSaveToggle,
    handleSave,
  } = usePreferencesSection({ preferences, onUpdate });

  return (
    <Card>
      <PreferencesSectionHeader />

      <CardContent className="space-y-4">
        <div className="space-y-4">
          <PreferencesSectionModelSelect
            value={localPreferences.defaultModel || 'gpt-4o-mini'}
            onChange={handleModelChange}
          />

          <PreferencesSectionAutoSaveToggle
            checked={localPreferences.autoSave || false}
            onToggle={handleAutoSaveToggle}
          />
        </div>

        <PreferencesSectionActions
          hasChanges={hasChanges}
          isSaving={isSaving}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  );
};

