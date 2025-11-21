/**
 * Navbar Component
 * Top navigation bar with user menu and mobile toggle
 * Following SRP: Only handles navbar UI and user interaction
 */

'use client';

import { useState } from 'react';
import type { UserProfile } from '@/lib/auth/utils';
import { UserMenu } from './user-menu';

interface NavbarProps {
  user: UserProfile;
  onMenuToggle: () => void;
}

export const Navbar = ({ user, onMenuToggle }: NavbarProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-background)] sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Center: Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className={cn(
                  'w-5 h-5 transition-colors',
                  isSearchFocused ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search agents, workflows..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <kbd className="absolute inset-y-0 right-3 hidden lg:flex items-center text-xs text-[var(--color-muted-foreground)] font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: User Menu & Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="p-2 hover:bg-[var(--color-accent)]/10 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-destructive)] rounded-full" />
          </button>

          {/* User Menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};

// Import cn utility
import { cn } from '@/utils/cn';

