/**
 * Run Status Utilities
 * Common status colors and labels for workflow runs, agent runs, and tool invocations
 * Following DRY: Centralizes status mapping logic
 */

import type {
  WorkflowRunStatus,
  AgentRunStatus,
  ToolInvocationStatus,
} from '@/types/workflow-execution.types';
import { formatDate } from '@/utils/format';

/**
 * Union type of all run statuses
 */
export type RunStatus = WorkflowRunStatus | AgentRunStatus | ToolInvocationStatus;

/**
 * Status color mapping for run statuses
 * Used for badge backgrounds
 */
export const runStatusColors: Record<RunStatus, string> = {
  pending: 'bg-gray-500',
  running: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  cancelled: 'bg-orange-500',
  skipped: 'bg-orange-500',
};

/**
 * Status label mapping for run statuses
 * Used for badge text
 */
export const runStatusLabels: Record<RunStatus, string> = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
  skipped: 'Skipped',
};

/**
 * Get status color for a run status
 */
export function getRunStatusColor(status: RunStatus): string {
  return runStatusColors[status] || runStatusColors.pending;
}

/**
 * Get status label for a run status
 */
export function getRunStatusLabel(status: RunStatus): string {
  return runStatusLabels[status] || runStatusLabels.pending;
}

/**
 * Calculate duration between two timestamps
 * Returns formatted duration string (e.g., "5s", "2m", "1h 30m")
 */
export function formatRunDuration(
  startedAt: string | null,
  finishedAt: string | null
): string {
  if (!startedAt || !finishedAt) {return '—';}

  const start = new Date(startedAt);
  const end = new Date(finishedAt);
  const diffMs = end.getTime() - start.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) {return `${diffSec}s`;}
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {return `${diffMin}m`;}
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ${diffMin % 60}m`;
}

/**
 * Format run card data (status colors, labels, duration)
 * Pure function - can be used in Server Components
 */
export function formatRunCardData(run: {
  status: RunStatus;
  started_at: string | null;
  finished_at: string | null;
}): {
  statusColor: string;
  statusLabel: string;
  duration: string;
} {
  return {
    statusColor: getRunStatusColor(run.status),
    statusLabel: getRunStatusLabel(run.status),
    duration: formatRunDuration(run.started_at, run.finished_at),
  };
}

/**
 * Format run detail header data (status, duration, formatted dates)
 * Pure function - can be used in Server Components
 */
export function formatRunDetailHeaderData(run: {
  status: RunStatus;
  started_at: string | null;
  finished_at: string | null;
}): {
  statusColor: string;
  statusLabel: string;
  duration: string;
  formattedStartedAt: string;
  formattedFinishedAt: string;
} {
  return {
    statusColor: getRunStatusColor(run.status),
    statusLabel: getRunStatusLabel(run.status),
    duration: formatRunDuration(run.started_at, run.finished_at),
    formattedStartedAt: run.started_at ? formatDate(run.started_at) : '—',
    formattedFinishedAt: run.finished_at ? formatDate(run.finished_at) : '—',
  };
}

