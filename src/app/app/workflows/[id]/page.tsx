/**
 * Workflow Detail Page
 * Displays detailed information about a single workflow
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWorkflow } from '@/lib/workflows/actions';
import { WorkflowDetailHeader } from '@/components/workflows/workflow-detail/workflow-detail-header';
import { WorkflowDetailContent } from '@/components/workflows/workflow-detail/workflow-detail-content';

interface WorkflowDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WorkflowDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: workflow } = await getWorkflow(id);
  
  return {
    title: workflow ? `${workflow.name} - Workflow` : 'Workflow Not Found',
    description: workflow?.description || 'Workflow details',
  };
}

export default async function WorkflowDetailPage({ params }: WorkflowDetailPageProps) {
  const { id } = await params;
  const { data: workflow, error } = await getWorkflow(id);

  if (error || !workflow) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <WorkflowDetailHeader workflow={workflow} />
      <WorkflowDetailContent workflow={workflow} />
    </div>
  );
}

