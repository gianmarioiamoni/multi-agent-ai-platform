/**
 * Notification Button Icon Component
 * Icon with badge for unread notifications
 * Following SRP: Only handles icon and badge rendering
 */

interface NotificationButtonIconProps {
  unreadCount: number;
}

export const NotificationButtonIcon = ({ unreadCount }: NotificationButtonIconProps) => {
  const hasUnread = unreadCount > 0;

  return (
    <>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
        />
      </svg>
      {hasUnread ? <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-destructive)] rounded-full" /> : null}
      {hasUnread && unreadCount > 0 ? <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--color-destructive)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span> : null}
    </>
  );
};

