/**
 * Settings Utilities
 * Helper functions to read user settings
 */

import { getCurrentUserProfile } from '@/lib/auth/utils';
import type { UserSettings } from '@/types/settings.types';
import { DEFAULT_SETTINGS } from '@/types/settings.types';

/**
 * Get user settings from profile
 * Returns merged settings with defaults
 */
export async function getUserSettingsFromProfile(): Promise<UserSettings> {
  const profile = await getCurrentUserProfile();
  
  if (!profile || !profile.settings) {
    return DEFAULT_SETTINGS;
  }

  const userSettings = profile.settings as Partial<UserSettings>;

  // Deep merge with defaults
  return {
    timezone: userSettings.timezone ?? DEFAULT_SETTINGS.timezone,
    notifications: {
      email: userSettings.notifications?.email ?? DEFAULT_SETTINGS.notifications?.email ?? true,
      inApp: userSettings.notifications?.inApp ?? DEFAULT_SETTINGS.notifications?.inApp ?? true,
      workflowRuns: userSettings.notifications?.workflowRuns ?? DEFAULT_SETTINGS.notifications?.workflowRuns ?? true,
      agentRuns: userSettings.notifications?.agentRuns ?? DEFAULT_SETTINGS.notifications?.agentRuns ?? true,
    },
    preferences: {
      defaultModel: userSettings.preferences?.defaultModel ?? DEFAULT_SETTINGS.preferences?.defaultModel,
      autoSave: userSettings.preferences?.autoSave ?? DEFAULT_SETTINGS.preferences?.autoSave ?? true,
    },
  };
}

/**
 * Get user timezone from settings
 * Returns timezone string or default
 */
export async function getUserTimezone(): Promise<string> {
  const settings = await getUserSettingsFromProfile();
  return settings.timezone || DEFAULT_SETTINGS.timezone || 'Europe/Rome';
}

/**
 * Check if user has specific notification enabled
 */
export async function hasNotificationEnabled(type: keyof NonNullable<UserSettings['notifications']>): Promise<boolean> {
  const settings = await getUserSettingsFromProfile();
  return settings.notifications?.[type] ?? true; // Default to true if not set
}

/**
 * Get default model from user settings
 */
export async function getDefaultModel(): Promise<string> {
  const settings = await getUserSettingsFromProfile();
  return settings.preferences?.defaultModel || DEFAULT_SETTINGS.preferences?.defaultModel || 'gpt-4o-mini';
}

/**
 * Check if auto-save is enabled
 */
export async function isAutoSaveEnabled(): Promise<boolean> {
  const settings = await getUserSettingsFromProfile();
  return settings.preferences?.autoSave ?? DEFAULT_SETTINGS.preferences?.autoSave ?? true;
}

