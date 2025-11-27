/**
 * Run Card Hook
 * Handles run card logic and formatting
 * Following SRP: Only manages run card logic
 */

import type { WorkflowRun } from '@/types/workflow-execution.types';
import { getRunStatusColor, getRunStatusLabel } from '@/utils/run-status';

interface UseRunCardProps {
  run: WorkflowRun;
}

interface UseRunCardReturn {
  statusColor: string;
  statusLabel: string;
  duration: string;
}

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

/**
 * Hook for managing run card logic
 */
export function useRunCard({ run }: UseRunCardProps): UseRunCardReturn {
  const statusColor = getRunStatusColor(run.status);
  const statusLabel = getRunStatusLabel(run.status);
  const duration = getDuration(run.started_at, run.finished_at);

  return {
    statusColor,
    statusLabel,
    duration,
  };
}

