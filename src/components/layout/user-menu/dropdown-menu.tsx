/**
 * Dropdown Menu Component
 * Menu content with items and logout
 * Following SRP: Only handles dropdown container and layout
 */

import { MenuItem } from './menu-item';
import { LogoutButton } from './logout-button';
import { DemoBadge } from '@/components/demo/demo-badge';

interface DropdownMenuProps {
  userName: string | null;
  userRole: string;
  isAdmin: boolean;
  isDemo: boolean;
  onItemClick: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const DropdownMenu = ({ 
  userName, 
  userRole, 
  isAdmin,
  isDemo,
  onItemClick, 
  onLogout, 
  isLoggingOut 
}: DropdownMenuProps) => {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-50">
      {/* User Info (Mobile) */}
      <div className="sm:hidden px-4 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            {userName || 'User'}
          </p>
          {isDemo ? <DemoBadge /> : null}
        </div>
        <p className="text-xs text-[var(--color-muted-foreground)] capitalize">
          {userRole}
        </p>
      </div>

      {/* Menu Items */}
      <MenuItem
        href="/app/account"
        onClick={onItemClick}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        label="My Account"
      />

      <MenuItem
        href="/app/settings"
        onClick={onItemClick}
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        label="Settings"
      />

      {isAdmin ? <MenuItem
          href="/admin"
          onClick={onItemClick}
          variant="primary"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          label="Admin Panel"
        /> : null}

      <div className="my-1 border-t border-[var(--color-border)]" />

      <LogoutButton onClick={onLogout} isLoading={isLoggingOut} />
    </div>
  );
};

