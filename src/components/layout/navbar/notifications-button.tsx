/**
 * Notifications Button Component
 * Button with notification badge and dropdown
 * Following SRP: Only handles notifications button composition
 */

'use client';

import { useNotificationsButton } from '@/hooks/notifications/use-notifications-button';
import { NotificationButtonIcon } from './notifications-button/notification-button-icon';
import { NotificationsDropdown } from './notifications-button/notifications-dropdown';

export const NotificationsButton = () => {
  const {
    isOpen,
    toggle,
    dropdownRef,
    notifications,
    isLoading,
    unreadCount,
    markAllAsRead,
    handleNotificationClick,
  } = useNotificationsButton();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggle}
        className="p-2 hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors relative"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <NotificationButtonIcon unreadCount={unreadCount} />
      </button>
      {isOpen ? <NotificationsDropdown
          notifications={notifications}
          isLoading={isLoading}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={markAllAsRead}
        /> : null}
    </div>
  );
};
