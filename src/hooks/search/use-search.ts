/**
 * Search Hook
 * Manages search state, debouncing, and keyboard shortcuts
 * Following SRP: Only handles search logic
 */

'use client';

import { useState, useEffect, useRef, useCallback, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { searchAll } from '@/lib/search/actions';
import type { SearchResult } from '@/lib/search/actions';

export const useSearch = (inputRef: RefObject<HTMLInputElement | null>) => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 2) {
      setTimeout(() => {
        setIsLoading(true);
      }, 0);
      searchTimeoutRef.current = setTimeout(async () => {
        const { data, error } = await searchAll(query);
        if (error) {
          console.error('Search error:', error);
          setResults([]);
        } else {
          setResults(data || []);
        }
        setIsLoading(false);
        setSelectedIndex(-1);
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
      setSelectedIndex(-1);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Escape to close
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
        setQuery('');
        setResults([]);
      }

      // Arrow down
      if (e.key === 'ArrowDown' && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      }

      // Arrow up
      if (e.key === 'ArrowUp' && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }

      // Enter to navigate
      if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href);
        setQuery('');
        setResults([]);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, results, selectedIndex, router, inputRef]);

  const handleResultClick = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
    inputRef.current?.blur();
  }, [inputRef]);

  const showResults = isFocused && (query.length >= 2 || isLoading || results.length > 0);

  return {
    isFocused,
    setIsFocused,
    query,
    setQuery,
    results,
    isLoading,
    selectedIndex,
    showResults,
    handleResultClick,
  };
};

