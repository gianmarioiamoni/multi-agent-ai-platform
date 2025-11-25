/**
 * Runs Page
 * View workflow execution history
 * Following SRP: Only handles page structure and data fetching
 */

import type { Metadata } from 'next';
import { getWorkflowRuns } from '@/lib/workflows/actions';
import { RunsHeader } from '@/components/runs/runs-header';
import { RunsList } from '@/components/runs/runs-list';
import { EmptyRunsState } from '@/components/runs/empty-runs-state';

export const metadata: Metadata = {
  title: 'Runs',
  description: 'View workflow execution history',
};

export default async function RunsPage() {
  const { data: runs, error } = await getWorkflowRuns();

  return (
    <div className="space-y-6">
      <RunsHeader />
      
      {error ? (
        <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
          Error loading workflow runs: {error}
        </div>
      ) : runs && runs.length > 0 ? (
        <RunsList runs={runs} />
      ) : (
        <EmptyRunsState />
      )}
    </div>
  );
}

