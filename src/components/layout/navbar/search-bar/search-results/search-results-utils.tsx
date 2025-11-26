/**
 * Search Results Utilities
 * Utility functions for search results
 * Following SRP: Only handles utility functions
 */

'use client';

import type { SearchResult } from '@/lib/search/actions';
import type React from 'react';

export const getTypeIcon = (type: SearchResult['type']): string => {
  return type === 'agent' ? '🤖' : '⚡';
};

export const getTypeLabel = (type: SearchResult['type']): string => {
  return type === 'agent' ? 'Agent' : 'Workflow';
};

export const highlightMatch = (text: string, query: string): React.JSX.Element => {
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

export const groupResultsByType = (results: SearchResult[]) => {
  return {
    agents: results.filter((r) => r.type === 'agent'),
    workflows: results.filter((r) => r.type === 'workflow'),
  };
};

