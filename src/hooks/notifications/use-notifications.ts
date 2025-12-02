/**
 * Notifications Hook
 * Manages notification state and read status
 * Following SRP: Only handles notification logic
 */

'use client';

import { useState, useCallback } from 'react';
import {
  getNotifications,
  markNotificationAsRead as markAsReadAction,
  markNotificationsAsRead as markAllAsReadAction,
} from '@/lib/notifications/actions';
import type { Notification } from '@/types/notification.types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getNotifications();
      if (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      } else if (data) {
        // Read status is now included from the database
        setTimeout(() => {
          setNotifications(data);
          const unread = data.filter((n) => !n.read).length;
          setUnreadCount(unread);
        }, 0);
      }
    } catch (_error) {
      console.error('Error in loadNotifications:', _error);
      setTimeout(() => {
        setNotifications([]);
        setUnreadCount(0);
      }, 0);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    }
  }, []);

  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      // Optimistically update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Mark as read in database
      const { error } = await markAsReadAction(notificationId);
      if (error) {
        console.error('Error marking notification as read:', error);
        // Revert optimistic update on error
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n))
        );
        setUnreadCount((prev) => prev + 1);
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    if (unreadNotifications.length === 0) {
      return;
    }

    // Optimistically update local state
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const previousUnreadCount = unreadCount;
    setUnreadCount(0);

    // Mark all as read in database
    const notificationIds = unreadNotifications.map((n) => n.id);
    const { error } = await markAllAsReadAction(notificationIds);
    if (error) {
      console.error('Error marking all notifications as read:', error);
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) =>
          unreadNotifications.some((un) => un.id === n.id)
            ? { ...n, read: false }
            : n
        )
      );
      setUnreadCount(previousUnreadCount);
    }
  }, [notifications, unreadCount]);

  return {
    notifications,
    isLoading,
    unreadCount,
    loadNotifications,
    markNotificationAsRead,
    markAllAsRead,
  };
};

