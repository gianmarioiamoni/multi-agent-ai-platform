/**
 * Notifications Section Hook
 * Handles notifications section logic and state
 * Following SRP: Only manages notifications section logic
 */

'use client';

import { useState } from 'react';
import type { NotificationSettings } from '@/types/settings.types';

interface UseNotificationsSectionProps {
  notifications: NotificationSettings;
  onUpdate: (notifications: Partial<NotificationSettings>) => Promise<void>;
}

interface UseNotificationsSectionReturn {
  localNotifications: NotificationSettings;
  hasChanges: boolean;
  handleToggle: (key: keyof NotificationSettings) => void;
  handleSave: () => Promise<void>;
}

/**
 * Hook for managing notifications section logic
 */
export function useNotificationsSection({
  notifications,
  onUpdate,
}: UseNotificationsSectionProps): UseNotificationsSectionReturn {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    const updated = {
      ...localNotifications,
      [key]: !localNotifications[key],
    };
    setLocalNotifications(updated);
    setHasChanges(JSON.stringify(updated) !== JSON.stringify(notifications));
  };

  const handleSave = async () => {
    await onUpdate(localNotifications);
    setHasChanges(false);
  };

  return {
    localNotifications,
    hasChanges,
    handleToggle,
    handleSave,
  };
}

