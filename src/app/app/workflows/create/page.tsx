/**
 * Create Workflow Page
 * Page for creating a new workflow
 */

import type { Metadata } from 'next';
import { getAgents } from '@/lib/agents/actions';
import { WorkflowBuilder } from '@/components/workflows/workflow-builder';

export const metadata: Metadata = {
  title: 'Create Workflow',
  description: 'Create a new multi-agent workflow',
};

export default async function CreateWorkflowPage() {
  const { data: agents, error } = await getAgents();

  if (error || !agents) {
    return (
      <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
        <p className="font-medium">Error loading agents</p>
        <p className="text-sm mt-1">{error || 'Failed to load agents'}</p>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Workflow</h1>
          <p className="text-muted-foreground mt-1">
            Build and automate multi-agent workflows
          </p>
        </div>
        <div className="p-12 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
            No Agents Available
          </h2>
          <p className="text-[var(--color-muted-foreground)] mb-6 max-w-md mx-auto">
            You need to create at least one agent before you can build a workflow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Workflow</h1>
        <p className="text-muted-foreground mt-1">
          Build and automate multi-agent workflows
        </p>
      </div>

      <WorkflowBuilder agents={agents} />
    </div>
  );
}

