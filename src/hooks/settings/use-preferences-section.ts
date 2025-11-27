/**
 * Preferences Section Hook
 * Handles preferences section logic and state
 * Following SRP: Only manages preferences section logic
 */

'use client';

import { useState } from 'react';
import type { UserPreferences } from '@/types/settings.types';

interface UsePreferencesSectionProps {
  preferences: UserPreferences;
  onUpdate: (preferences: Partial<UserPreferences>) => Promise<void>;
}

interface UsePreferencesSectionReturn {
  localPreferences: UserPreferences;
  hasChanges: boolean;
  handleModelChange: (model: string) => void;
  handleAutoSaveToggle: () => void;
  handleSave: () => Promise<void>;
}

/**
 * Hook for managing preferences section logic
 */
export function usePreferencesSection({
  preferences,
  onUpdate,
}: UsePreferencesSectionProps): UsePreferencesSectionReturn {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleModelChange = (model: string) => {
    const updated = { ...localPreferences, defaultModel: model };
    setLocalPreferences(updated);
    setHasChanges(
      JSON.stringify(updated) !==
        JSON.stringify({ ...preferences, defaultModel: preferences.defaultModel })
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

  return {
    localPreferences,
    hasChanges,
    handleModelChange,
    handleAutoSaveToggle,
    handleSave,
  };
}

