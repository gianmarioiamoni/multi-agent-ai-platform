/**
 * Notification Utilities
 * Client-side utilities for notification handling
 */

import type { Notification } from '@/types/notification.types';

/**
 * Mark notifications as read based on read IDs
 * This is a client-side utility function
 */
export function markNotificationsAsRead(
  notifications: Notification[],
  readIds: string[]
): Notification[] {
  const readIdsSet = new Set(readIds);
  return notifications.map((notification) => ({
    ...notification,
    read: readIdsSet.has(notification.id),
  }));
}

