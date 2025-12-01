/**
 * Search Input Component
 * Search input field with icon and keyboard shortcut display
 * Following SRP: Only handles input rendering
 */

'use client';

import type { RefObject } from 'react';
import { cn } from '@/utils/cn';

interface SearchInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  isFocused: boolean;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
}

export const SearchInput = ({
  inputRef,
  query,
  isFocused,
  onQueryChange,
  onFocus,
}: SearchInputProps) => {
  return (
    <>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className={cn(
            'w-5 h-5 transition-colors',
            isFocused ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Search Input */}
      <input
        ref={inputRef}
        type="search"
        placeholder="Search agents, workflows..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-input)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-all"
        onFocus={onFocus}
      />

      {/* Keyboard Shortcut (hide when typing) */}
      {!query ? <kbd className="absolute inset-y-0 right-3 hidden lg:flex items-center text-xs text-[var(--color-muted-foreground)] font-mono pointer-events-none">
          ⌘K
        </kbd> : null}
    </>
  );
};

