/**
 * Edit Workflow Page
 * Page for editing an existing workflow
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWorkflow } from '@/lib/workflows/actions';
import { getAgents } from '@/lib/agents/actions';
import { WorkflowBuilder } from '@/components/workflows/workflow-builder';
import { BreadcrumbsLabelUpdater } from '@/components/breadcrumbs/breadcrumbs-provider';

interface EditWorkflowPageProps {
  params: Promise<{ id: string }>;
}

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: EditWorkflowPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: workflow } = await getWorkflow(id);
  
  return {
    title: workflow ? `Edit ${workflow.name} - Workflow` : 'Workflow Not Found',
    description: 'Edit your workflow configuration',
  };
}

export default async function EditWorkflowPage({ params }: EditWorkflowPageProps) {
  const { id } = await params;
  const { data: workflow, error: workflowError } = await getWorkflow(id);
  const { data: agents, error: agentsError } = await getAgents();

  if (workflowError || !workflow) {
    notFound();
  }

  if (agentsError || !agents) {
    return (
      <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
        <p className="font-medium">Error loading agents</p>
        <p className="text-sm mt-1">{agentsError || 'Failed to load agents'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Update breadcrumbs with workflow name */}
      <BreadcrumbsLabelUpdater customLabels={{ 
        [`/app/workflows/${id}`]: workflow.name,
        [`/app/workflows/${id}/edit`]: 'Edit'
      }} />
      <div>
        <h1 className="text-3xl font-bold">Edit Workflow</h1>
        <p className="text-muted-foreground mt-1">
          Modify your workflow configuration
        </p>
      </div>

      <WorkflowBuilder workflow={workflow} agents={agents} />
    </div>
  );
}

