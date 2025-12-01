/**
 * Notifications Dropdown Component
 * Displays list of notifications in a dropdown
 * Following SRP: Only handles notifications dropdown UI
 */

'use client';

import Link from 'next/link';
import type { Notification } from '@/types/notification.types';
import { formatRelativeTime } from '@/utils/format';

interface NotificationsDropdownProps {
  notifications: Notification[];
  isLoading?: boolean;
  onNotificationClick?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'workflow_completed':
      return '✅';
    case 'workflow_failed':
      return '❌';
    case 'workflow_started':
      return '🔄';
    case 'integration_error':
      return '⚠️';
    case 'system':
      return 'ℹ️';
    default:
      return '🔔';
  }
};

const getNotificationColor = (type: Notification['type']): string => {
  switch (type) {
    case 'workflow_completed':
      return 'text-green-400';
    case 'workflow_failed':
      return 'text-red-400';
    case 'workflow_started':
      return 'text-blue-400';
    case 'integration_error':
      return 'text-yellow-400';
    case 'system':
      return 'text-gray-400';
    default:
      return 'text-gray-400';
  }
};

export const NotificationsDropdown = ({
  notifications,
  isLoading = false,
  onNotificationClick,
  onMarkAllAsRead,
}: NotificationsDropdownProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  if (isLoading) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
        <div className="p-4 text-center text-[var(--color-muted-foreground)]">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-[var(--color-muted-foreground)] mb-2">No notifications</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            You&apos;re all caught up!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="font-semibold text-[var(--color-foreground)]">Notifications</h3>
        {unreadCount > 0 && onMarkAllAsRead ? <button
            onClick={onMarkAllAsRead}
            className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors"
          >
            Mark all as read
          </button> : null}
      </div>
      <div className="overflow-y-auto">
        {notifications.map((notification) => {
          const content = (
            <div
              className={`p-4 border-b border-[var(--color-border)] hover:bg-[var(--color-accent)]/10 transition-colors ${
                !notification.read ? 'bg-[var(--color-primary)]/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-xl ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--color-foreground)]">
                    {notification.title}
                  </p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read ? <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full flex-shrink-0 mt-2" /> : null}
              </div>
            </div>
          );

          if (notification.href) {
            return (
              <Link
                key={notification.id}
                href={notification.href}
                onClick={() => onNotificationClick?.(notification.id)}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={notification.id}
              onClick={() => onNotificationClick?.(notification.id)}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

