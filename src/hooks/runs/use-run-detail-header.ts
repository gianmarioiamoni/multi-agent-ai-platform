/**
 * Run Detail Header Hook
 * Handles run detail header logic and formatting
 * Following SRP: Only manages run detail header logic
 */

import type { WorkflowRun } from '@/types/workflow-execution.types';
import { getRunStatusColor, getRunStatusLabel } from '@/utils/run-status';
import { formatDate } from '@/utils/format';

interface UseRunDetailHeaderProps {
  run: WorkflowRun;
}

interface UseRunDetailHeaderReturn {
  statusColor: string;
  statusLabel: string;
  duration: string;
  formattedStartedAt: string;
  formattedFinishedAt: string;
}

const getDuration = (startedAt: string | null, finishedAt: string | null): string => {
  if (!startedAt || !finishedAt) return '—';

  const start = new Date(startedAt);
  const end = new Date(finishedAt);
  const diffMs = end.getTime() - start.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ${diffSec % 60}s`;
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ${diffMin % 60}m ${diffSec % 60}s`;
};

/**
 * Hook for managing run detail header logic
 */
export function useRunDetailHeader({
  run,
}: UseRunDetailHeaderProps): UseRunDetailHeaderReturn {
  const statusColor = getRunStatusColor(run.status);
  const statusLabel = getRunStatusLabel(run.status);
  const duration = getDuration(run.started_at, run.finished_at);
  const formattedStartedAt = run.started_at ? formatDate(run.started_at) : '—';
  const formattedFinishedAt = run.finished_at ? formatDate(run.finished_at) : '—';

  return {
    statusColor,
    statusLabel,
    duration,
    formattedStartedAt,
    formattedFinishedAt,
  };
}

