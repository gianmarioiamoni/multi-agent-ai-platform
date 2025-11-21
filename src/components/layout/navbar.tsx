/**
 * Navbar Component
 * Top navigation bar with user menu and mobile toggle
 * Following SRP: Only handles navbar composition
 */

import type { UserProfile } from '@/lib/auth/utils';
import { UserMenu } from './user-menu';
import { MobileMenuToggle } from './navbar/mobile-menu-toggle';
import { SearchBar } from './navbar/search-bar';
import { NotificationsButton } from './navbar/notifications-button';

interface NavbarProps {
  user: UserProfile;
  onMenuToggle: () => void;
}

export const Navbar = ({ user, onMenuToggle }: NavbarProps) => {
  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-background)] sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle */}
        <MobileMenuToggle onToggle={onMenuToggle} />

        {/* Center: Search (Desktop) */}
        <SearchBar />

        {/* Right: User Menu & Actions */}
        <div className="flex items-center gap-2">
          <NotificationsButton />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};

