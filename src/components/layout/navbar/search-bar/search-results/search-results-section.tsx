/**
 * Search Results Section Component
 * Section with grouped results by type (agents or workflows)
 * Following SRP: Only handles section rendering
 */

'use client';

import type { SearchResult } from '@/lib/search/actions';
import { SearchResultItem } from './search-result-item';

interface SearchResultsSectionProps {
  title: string;
  results: SearchResult[];
  allResults: SearchResult[];
  query: string;
  selectedIndex: number;
  onResultClick?: () => void;
}

export const SearchResultsSection = ({
  title,
  results,
  allResults,
  query,
  selectedIndex,
  onResultClick,
}: SearchResultsSectionProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="px-4 py-2 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase border-b border-[var(--color-border)] bg-[var(--color-muted)]/30">
        {title} ({results.length})
      </div>
      {results.map((result, index) => {
        const globalIndex = allResults.indexOf(result);
        const isSelected = globalIndex === selectedIndex;
        const isLast = index === results.length - 1;
        
        return (
          <SearchResultItem
            key={result.id}
            result={result}
            query={query}
            isSelected={isSelected}
            onResultClick={onResultClick}
            isLast={isLast}
          />
        );
      })}
    </div>
  );
};

