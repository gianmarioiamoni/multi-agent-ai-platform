/**
 * Run Card Component
 * Displays a single workflow run in card format
 * Following SRP: Only handles run card rendering
 */

'use client';

import Link from 'next/link';
import type { WorkflowRun } from '@/types/workflow-execution.types';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utils/format';

interface RunCardProps {
  run: WorkflowRun & { workflow_name: string };
}

const statusColors = {
  pending: 'bg-gray-500',
  running: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  cancelled: 'bg-orange-500',
};

const statusLabels = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

const getDuration = (startedAt: string | null, finishedAt: string | null): string => {
  if (!startedAt || !finishedAt) return '—';
  
  const start = new Date(startedAt);
  const end = new Date(finishedAt);
  const diffMs = end.getTime() - start.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ${diffMin % 60}m`;
};

export const RunCard = ({ run }: RunCardProps) => {
  return (
    <Link href={`/app/runs/${run.id}`}>
      <Card className="h-full border-2 border-[var(--color-border)] hover:!border-[var(--color-primary)] hover:shadow-lg transition-all cursor-pointer group p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors mb-1">
              {run.workflow_name}
            </h3>
            {run.input && (
              <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mt-1">
                {run.input}
              </p>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium text-white rounded ${statusColors[run.status]}`}
          >
            {statusLabels[run.status]}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
          <span>Started {run.started_at ? formatDate(run.started_at) : '—'}</span>
          {run.started_at && run.finished_at && (
            <span>Duration: {getDuration(run.started_at, run.finished_at)}</span>
          )}
        </div>
      </Card>
    </Link>
  );
};

