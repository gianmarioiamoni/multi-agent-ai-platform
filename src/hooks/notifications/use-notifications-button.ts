/**
 * Notifications Button Hook
 * Manages notifications button state and polling logic
 * Following SRP: Only handles notifications button logic
 */

'use client';

import { useEffect } from 'react';
import { useDropdown } from '@/hooks/shared/use-dropdown';
import { useNotifications } from '@/hooks/notifications/use-notifications';

export const useNotificationsButton = () => {
  const { isOpen, toggle, close, dropdownRef } = useDropdown();
  const {
    notifications,
    isLoading,
    unreadCount,
    loadNotifications,
    markNotificationAsRead,
    markAllAsRead,
  } = useNotifications();

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        loadNotifications();
      }
    }, 30000);

    // Initial load
    loadNotifications();

    return () => clearInterval(interval);
  }, [isOpen, loadNotifications]);

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    close();
  };

  return {
    isOpen,
    toggle,
    dropdownRef,
    notifications,
    isLoading,
    unreadCount,
    markAllAsRead,
    handleNotificationClick,
  };
};

