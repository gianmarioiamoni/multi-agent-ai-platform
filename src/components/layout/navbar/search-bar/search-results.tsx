/**
 * Search Results Component
 * Displays search results in a dropdown
 * Following SRP: Only handles search results composition
 */

'use client';

import type { SearchResult } from '@/lib/search/actions';
import {
  SearchResultsLoading,
  SearchResultsMinLength,
  SearchResultsEmpty,
} from './search-results/search-results-states';
import { SearchResultsList } from './search-results/search-results-list';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  selectedIndex?: number;
  onResultClick?: () => void;
}

export const SearchResults = ({
  results,
  query,
  isLoading = false,
  selectedIndex = -1,
  onResultClick,
}: SearchResultsProps) => {
  if (isLoading) {
    return <SearchResultsLoading />;
  }

  if (query.length > 0 && query.length < 2) {
    return <SearchResultsMinLength />;
  }

  if (results.length === 0 && query.length >= 2) {
    return <SearchResultsEmpty />;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
      <SearchResultsList
        results={results}
        query={query}
        selectedIndex={selectedIndex}
        onResultClick={onResultClick}
      />
    </div>
  );
};

