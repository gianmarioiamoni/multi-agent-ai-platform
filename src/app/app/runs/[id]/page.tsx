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
import { BreadcrumbsLabelUpdater } from '@/components/breadcrumbs/breadcrumbs-provider';

type PageProps = {
  params: Promise<{ id: string }>;
};

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

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
      {/* Update breadcrumbs with run ID */}
      <BreadcrumbsLabelUpdater customLabels={{ 
        [`/app/runs/${id}`]: `Run #${id.substring(0, 8)}`
      }} />
      <RunDetailHeader run={run} />
      <RunTimeline run={run} />
    </div>
  );
}

