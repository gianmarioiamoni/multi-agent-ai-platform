/**
 * Settings Client Component
 * Client component wrapper for settings page
 * Following SRP: Only handles client-side state and composition
 */

'use client';

import { SettingsHeader } from './settings-header';
import { TimezoneSection } from './timezone-section';
import { NotificationsSection } from './notifications-section';
import { PreferencesSection } from './preferences-section';
import { useSettings } from '@/hooks/settings/use-settings';
import { DEFAULT_SETTINGS } from '@/types/settings.types';

export const SettingsClient = () => {
  const { settings, isLoading, isSaving, updateSettings } = useSettings();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SettingsHeader />
        <div className="p-12 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
          <p className="text-[var(--color-muted-foreground)]">Loading settings...</p>
        </div>
      </div>
    );
  }

  const currentSettings = settings || DEFAULT_SETTINGS;

  return (
    <div className="space-y-6">
      <SettingsHeader />

      <div className="space-y-6">
        <TimezoneSection
          timezone={currentSettings.timezone || DEFAULT_SETTINGS.timezone!}
          onUpdate={async (timezone) => {
            await updateSettings({ timezone });
          }}
          isSaving={isSaving}
        />

        <NotificationsSection
          notifications={currentSettings.notifications || DEFAULT_SETTINGS.notifications!}
          onUpdate={async (notificationsPartial) => {
            // Merge partial notifications with current to ensure all fields are present
            const fullNotifications = {
              ...(currentSettings.notifications || DEFAULT_SETTINGS.notifications!),
              ...notificationsPartial,
            };
            await updateSettings({ notifications: fullNotifications });
          }}
          isSaving={isSaving}
        />

        <PreferencesSection
          preferences={currentSettings.preferences || DEFAULT_SETTINGS.preferences!}
          onUpdate={async (preferences) => {
            await updateSettings({ preferences });
          }}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

