/**
 * User Menu Component  
 * Dropdown menu with user actions and logout
 * Following SRP: Only handles user menu UI and interactions
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from '@/lib/auth/actions';
import { useToast } from '@/contexts/toast-context';
import type { UserProfile } from '@/lib/auth/utils';
import { cn } from '@/utils/cn';

interface UserMenuProps {
  user: UserProfile;
}

export const UserMenu = ({ user }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { error: showError } = useToast();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    
    try {
      await signOut();
    } catch (err) {
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        throw err;
      }
      showError('Logout failed', 'Please try again');
      setIsLoggingOut(false);
    }
  };

  // Get initials for avatar
  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user.userId.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg transition-colors',
          isOpen
            ? 'bg-[var(--color-accent)]/10'
            : 'hover:bg-[var(--color-accent)]/10'
        )}
        disabled={isLoggingOut}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>

        {/* User Info (Desktop) */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-[var(--color-muted-foreground)] capitalize">
            {user.role}
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-50">
          {/* User Info (Mobile) */}
          <div className="sm:hidden px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-[var(--color-muted-foreground)] capitalize">
              {user.role}
            </p>
          </div>

          {/* Menu Items */}
          <Link
            href="/app/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Account
          </Link>

          <Link
            href="/app/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>

          {user.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-accent)]/10 transition-colors text-[var(--color-primary)]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin Panel
            </Link>
          )}

          <div className="my-1 border-t border-[var(--color-border)]" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-3 px-4 py-2 text-sm w-full text-left hover:bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
};

