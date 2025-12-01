/**
 * User Menu Component  
 * Dropdown menu with user actions and logout
 * Following SRP: Only handles user menu composition
 */

'use client';

import { useDropdown } from '@/hooks/shared/use-dropdown';
import { useLogout } from '@/hooks/auth/use-logout';
import { UserButton } from './user-menu/user-button';
import { DropdownMenu } from './user-menu/dropdown-menu';
import type { UserProfile } from '@/lib/auth/utils';

interface UserMenuProps {
  user: UserProfile;
  isDemo: boolean;
}

export const UserMenu = ({ user, isDemo }: UserMenuProps) => {
  const { isOpen, toggle, close, dropdownRef } = useDropdown();
  const { isLoggingOut, handleLogout } = useLogout();

  const onLogout = async () => {
    close();
    await handleLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <UserButton
        userName={user.name}
        userRole={user.role}
        isDemo={isDemo}
        isOpen={isOpen}
        isDisabled={isLoggingOut}
        onClick={toggle}
      />

      {isOpen ? <DropdownMenu
          userName={user.name}
          userRole={user.role}
          isAdmin={user.role === 'admin'}
          isDemo={isDemo}
          onItemClick={close}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        /> : null}
    </div>
  );
};

