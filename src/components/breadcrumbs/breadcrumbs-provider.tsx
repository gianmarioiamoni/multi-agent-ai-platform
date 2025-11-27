/**
 * Breadcrumbs Label Updater Component
 * Client Component to update breadcrumb labels from Server Components
 * Use this in pages that need dynamic breadcrumb labels
 */

'use client';

import { useEffect } from 'react';
import { useBreadcrumbs } from '@/contexts/breadcrumbs-context';

interface BreadcrumbsLabelUpdaterProps {
  /**
   * Custom labels for breadcrumbs
   * e.g., { '/app/agents/123': 'My Agent Name' }
   */
  customLabels: Record<string, string>;
}

/**
 * Client Component to update breadcrumb labels
 * Use this in Server Components to pass custom labels
 * Example: <BreadcrumbsLabelUpdater customLabels={{ '/app/agents/123': agent.name }} />
 */
export const BreadcrumbsLabelUpdater = ({ customLabels }: BreadcrumbsLabelUpdaterProps) => {
  const { setCustomLabels } = useBreadcrumbs();

  useEffect(() => {
    setCustomLabels(customLabels);
    // Cleanup: clear custom labels when component unmounts
    return () => {
      setCustomLabels({});
    };
  }, [customLabels, setCustomLabels]);

  return null;
};

