/**
 * User Settings Types
 * Type definitions for user preferences and settings
 */

export interface UserSettings {
  timezone?: string;
  notifications?: NotificationSettings;
  preferences?: UserPreferences;
}

export interface NotificationSettings {
  email: boolean;
  inApp: boolean;
  workflowRuns: boolean;
  agentRuns: boolean;
}

export interface UserPreferences {
  defaultModel?: string;
  autoSave?: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  timezone: 'Europe/Rome',
  notifications: {
    email: true,
    inApp: true,
    workflowRuns: true,
    agentRuns: true,
  },
  preferences: {
    defaultModel: 'gpt-4o-mini',
    autoSave: true,
  },
};

