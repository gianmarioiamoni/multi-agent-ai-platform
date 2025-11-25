/**
 * Workflow Run Detail Page
 * Shows detailed information about a workflow run execution
 * Following SRP: Only handles page structure and data fetching
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWorkflowRun } from '@/lib/workflows/actions';
import { RunDetailHeader } from '@/components/runs/run-detail-header';
import { RunTimeline } from '@/components/runs/run-timeline';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Run ${id.slice(0, 8)}...`,
    description: 'View detailed workflow run execution',
  };
}

export default async function RunDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: run, error } = await getWorkflowRun(id);

  if (error || !run) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <RunDetailHeader run={run} />
      <RunTimeline run={run} />
    </div>
  );
}

