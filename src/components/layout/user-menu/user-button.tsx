/**
 * User Button Component
 * Button that triggers user menu dropdown
 * Following SRP: Only handles user button UI
 */

import { UserAvatar } from '@/components/ui/user-avatar';
import { cn } from '@/utils/cn';

interface UserButtonProps {
  userName: string | null;
  userRole: string;
  isOpen: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export const UserButton = ({ 
  userName, 
  userRole, 
  isOpen, 
  isDisabled, 
  onClick 
}: UserButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-2 rounded-lg transition-colors',
        isOpen
          ? 'bg-[var(--color-accent)]/10'
          : 'hover:bg-[var(--color-accent)]/10'
      )}
      disabled={isDisabled}
    >
      <UserAvatar name={userName} />

      {/* User Info (Desktop) */}
      <div className="hidden sm:block text-left">
        <p className="text-sm font-medium text-[var(--color-foreground)]">
          {userName || 'User'}
        </p>
        <p className="text-xs text-[var(--color-muted-foreground)] capitalize">
          {userRole}
        </p>
      </div>

      {/* Chevron */}
      <svg
        className={cn(
          'hidden sm:block w-4 h-4 text-[var(--color-muted-foreground)] transition-transform',
          isOpen && 'rotate-180'
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

