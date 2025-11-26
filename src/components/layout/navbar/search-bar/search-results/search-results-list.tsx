/**
 * Search Results List Component
 * List of search results grouped by type
 * Following SRP: Only handles results list rendering
 */

'use client';

import type { SearchResult } from '@/lib/search/actions';
import { groupResultsByType } from './search-results-utils';
import { SearchResultsSection } from './search-results-section';

interface SearchResultsListProps {
  results: SearchResult[];
  query: string;
  selectedIndex: number;
  onResultClick?: () => void;
}

export const SearchResultsList = ({
  results,
  query,
  selectedIndex,
  onResultClick,
}: SearchResultsListProps) => {
  const { agents, workflows } = groupResultsByType(results);

  return (
    <div className="overflow-y-auto">
      <SearchResultsSection
        title="Agents"
        results={agents}
        allResults={results}
        query={query}
        selectedIndex={selectedIndex}
        onResultClick={onResultClick}
      />
      <SearchResultsSection
        title="Workflows"
        results={workflows}
        allResults={results}
        query={query}
        selectedIndex={selectedIndex}
        onResultClick={onResultClick}
      />
    </div>
  );
};

