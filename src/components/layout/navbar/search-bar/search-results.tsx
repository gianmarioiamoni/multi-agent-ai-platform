/**
 * Search Results Component
 * Displays search results in a dropdown
 * Following SRP: Only handles search results rendering
 */

'use client';

import type React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import type { SearchResult } from '@/lib/search/actions';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  selectedIndex?: number;
  onResultClick?: () => void;
}

const getTypeIcon = (type: SearchResult['type']): string => {
  return type === 'agent' ? '🤖' : '⚡';
};

const getTypeLabel = (type: SearchResult['type']): string => {
  return type === 'agent' ? 'Agent' : 'Workflow';
};

const highlightMatch = (text: string, query: string): React.JSX.Element => {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return <span>{text}</span>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <span>
      {before}
      <mark className="bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
        {match}
      </mark>
      {after}
    </span>
  );
};

export const SearchResults = ({
  results,
  query,
  isLoading = false,
  selectedIndex = -1,
  onResultClick,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
        <div className="p-4 text-center text-[var(--color-muted-foreground)]">
          Searching...
        </div>
      </div>
    );
  }

  if (query.length > 0 && query.length < 2) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
        <div className="p-4 text-center text-[var(--color-muted-foreground)]">
          Type at least 2 characters to search
        </div>
      </div>
    );
  }

  if (results.length === 0 && query.length >= 2) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-[var(--color-muted-foreground)] mb-2">No results found</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Try searching for agents or workflows
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  const agents = results.filter((r) => r.type === 'agent');
  const workflows = results.filter((r) => r.type === 'workflow');

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
      <div className="overflow-y-auto">
        {agents.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase border-b border-[var(--color-border)] bg-[var(--color-muted)]/30">
              Agents ({agents.length})
            </div>
            {agents.map((result, index) => {
              const globalIndex = results.indexOf(result);
              const isSelected = globalIndex === selectedIndex;
              return (
                <Link
                  key={result.id}
                  href={result.href}
                  onClick={onResultClick}
                  className={cn(
                    'block p-4 transition-colors border-b border-[var(--color-border)]',
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
            })}
          </div>
        )}

        {workflows.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase border-b border-[var(--color-border)] bg-[var(--color-muted)]/30">
              Workflows ({workflows.length})
            </div>
            {workflows.map((result, index) => {
              const globalIndex = results.indexOf(result);
              const isSelected = globalIndex === selectedIndex;
              return (
                <Link
                  key={result.id}
                  href={result.href}
                  onClick={onResultClick}
                  className={cn(
                    'block p-4 transition-colors border-b border-[var(--color-border)] last:border-b-0',
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

