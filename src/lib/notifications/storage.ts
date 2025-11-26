/**
 * Notification Storage Utilities
 * Handles local storage of read notifications
 * Following SRP: Only handles notification read status storage
 */

const STORAGE_KEY = 'notification_reads';

/**
 * Get list of read notification IDs from localStorage
 */
export function getReadNotificationIds(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return new Set();
    }
    const ids = JSON.parse(stored) as string[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

/**
 * Mark a notification as read in localStorage
 */
export function markNotificationAsRead(notificationId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const readIds = getReadNotificationIds();
    readIds.add(notificationId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

/**
 * Mark multiple notifications as read
 */
export function markNotificationsAsRead(notificationIds: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const readIds = getReadNotificationIds();
    notificationIds.forEach((id) => readIds.add(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)));
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
}

/**
 * Clear all read notifications (useful for testing or reset)
 */
export function clearReadNotifications(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing read notifications:', error);
  }
}

