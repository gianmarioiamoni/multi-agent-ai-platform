/**
 * Search Result Item Component
 * Single search result item with link
 * Following SRP: Only handles single result item rendering
 */

'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import type { SearchResult } from '@/lib/search/actions';
import { getTypeIcon, getTypeLabel, highlightMatch } from './search-results-utils';

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  isSelected: boolean;
  onResultClick?: () => void;
  isLast?: boolean;
}

export const SearchResultItem = ({
  result,
  query,
  isSelected,
  onResultClick,
  isLast = false,
}: SearchResultItemProps) => {
  return (
    <Link
      href={result.href}
      onClick={onResultClick}
      className={cn(
        'block p-4 transition-colors border-b border-[var(--color-border)]',
        isLast && 'last:border-b-0',
        isSelected
          ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20'
          : 'hover:bg-[var(--color-accent)]/10'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{getTypeIcon(result.type)}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-[var(--color-foreground)]">
            {highlightMatch(result.name, query)}
          </p>
          {result.description && (
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1 line-clamp-1">
              {highlightMatch(result.description, query)}
            </p>
          )}
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
            {getTypeLabel(result.type)}
          </p>
        </div>
      </div>
    </Link>
  );
};

