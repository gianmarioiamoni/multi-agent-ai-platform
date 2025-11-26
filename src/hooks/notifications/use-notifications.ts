/**
 * Notifications Hook
 * Manages notification state and read status
 * Following SRP: Only handles notification logic
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getNotifications } from '@/lib/notifications/actions';
import { markNotificationAsRead as markAsReadStorage, getReadNotificationIds } from '@/lib/notifications/storage';
import { markNotificationsAsRead } from '@/lib/notifications/utils';
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
        // Get read notification IDs from localStorage
        const readIds = Array.from(getReadNotificationIds());
        
        // Mark notifications as read based on storage
        const notificationsWithReadStatus = markNotificationsAsRead(data, readIds);
        
        setNotifications(notificationsWithReadStatus);
        const unread = notificationsWithReadStatus.filter((n) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error in loadNotifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    // Mark as read in localStorage
    markAsReadStorage(notificationId);
    
    // Update local state
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    
    // Update unread count
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    unreadNotifications.forEach((n) => markAsReadStorage(n.id));
    
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [notifications]);

  return {
    notifications,
    isLoading,
    unreadCount,
    loadNotifications,
    markNotificationAsRead,
    markAllAsRead,
  };
};

