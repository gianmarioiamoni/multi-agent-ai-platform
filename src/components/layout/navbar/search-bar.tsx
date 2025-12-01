/**
 * Search Bar Component
 * Search input with icon, keyboard shortcut, and results dropdown
 * Following SRP: Only handles search bar composition
 */

'use client';

import { useRef, useEffect } from 'react';
import { useSearch } from '@/hooks/search/use-search';
import { SearchInput } from './search-bar/search-input';
import { SearchResults } from './search-bar/search-results';

export const SearchBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isFocused,
    setIsFocused,
    query,
    setQuery,
    results,
    isLoading,
    selectedIndex,
    showResults,
    handleResultClick,
  } = useSearch(inputRef);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isFocused, setIsFocused]);

  return (
    <div className="hidden md:flex flex-1 max-w-2xl">
      <div className="relative w-full" ref={containerRef}>
        <SearchInput
          inputRef={inputRef}
          query={query}
          isFocused={isFocused}
          onQueryChange={setQuery}
          onFocus={() => setIsFocused(true)}
        />

        {showResults ? <SearchResults
            results={results}
            query={query}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            onResultClick={handleResultClick}
          /> : null}
      </div>
    </div>
  );
};

