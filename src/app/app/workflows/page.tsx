/**
 * Workflows Page
 * List and manage workflows
 */

import type { Metadata } from 'next';
import { getWorkflows } from '@/lib/workflows/actions';
import { WorkflowsHeader } from '@/components/workflows/workflows-header';
import { WorkflowsList } from '@/components/workflows/workflows-list';
import { EmptyWorkflowsState } from '@/components/workflows/empty-workflows-state';

export const metadata: Metadata = {
  title: 'Workflows',
  description: 'Manage your workflows',
};

export default async function WorkflowsPage() {
  const { data: workflows, error } = await getWorkflows();

  return (
    <div className="space-y-6">
      <WorkflowsHeader />
      
      {error ? (
        <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
          Error loading workflows: {error}
        </div>
      ) : workflows && workflows.length > 0 ? (
        <WorkflowsList workflows={workflows} />
      ) : (
        <EmptyWorkflowsState />
      )}
    </div>
  );
}
