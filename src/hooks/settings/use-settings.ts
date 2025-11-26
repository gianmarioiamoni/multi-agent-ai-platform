/**
 * Settings Hook
 * Manages user settings loading and updates
 * Following SRP: Only handles settings state management
 */

'use client';

import { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '@/lib/settings/actions';
import { useToast } from '@/contexts/toast-context';
import type { UserSettings } from '@/types/settings.types';
import { DEFAULT_SETTINGS } from '@/types/settings.types';

interface UseSettingsReturn {
  settings: UserSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

/**
 * Hook for managing user settings
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error: showError } = useToast();

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      const result = await getUserSettings();

      if (result.success) {
        // Deep merge with defaults if settings exist
        if (result.data) {
          const merged: UserSettings = {
            ...DEFAULT_SETTINGS,
            ...result.data,
            notifications: {
              ...DEFAULT_SETTINGS.notifications!,
              ...(result.data.notifications || {}),
            } as typeof DEFAULT_SETTINGS.notifications,
            preferences: {
              ...DEFAULT_SETTINGS.preferences!,
              ...(result.data.preferences || {}),
            } as typeof DEFAULT_SETTINGS.preferences,
          };
          setSettings(merged);
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      } else {
        showError('Failed to load settings', result.error);
        setSettings(DEFAULT_SETTINGS);
      }
      setIsLoading(false);
    };

    loadSettings();
  }, [showError]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setIsSaving(true);
    const result = await updateUserSettings(newSettings);

    if (result.success && result.data) {
      // Deep merge with defaults
      const merged: UserSettings = {
        ...DEFAULT_SETTINGS,
        ...result.data,
        notifications: {
          ...DEFAULT_SETTINGS.notifications!,
          ...(result.data.notifications || {}),
        } as typeof DEFAULT_SETTINGS.notifications,
        preferences: {
          ...DEFAULT_SETTINGS.preferences!,
          ...(result.data.preferences || {}),
        } as typeof DEFAULT_SETTINGS.preferences,
      };
      setSettings(merged);
      success('Settings updated', 'Your preferences have been saved successfully');
    } else {
      showError('Failed to update settings', result.error);
    }
    setIsSaving(false);
  };

  return {
    settings: settings || DEFAULT_SETTINGS,
    isLoading,
    isSaving,
    updateSettings,
  };
}

