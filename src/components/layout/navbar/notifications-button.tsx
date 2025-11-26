/**
 * Notifications Button Component
 * Button with notification badge and dropdown
 * Following SRP: Only handles notifications button UI and state
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useNotifications } from './use-notifications';
import { NotificationsDropdown } from './notifications-dropdown';

export const NotificationsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

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
    setIsOpen(false);
  };

  const hasUnread = unreadCount > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors relative"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-destructive)] rounded-full" />
        )}
        {hasUnread && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--color-destructive)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <NotificationsDropdown
          notifications={notifications}
          isLoading={isLoading}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={markAllAsRead}
        />
      )}
    </div>
  );
};
