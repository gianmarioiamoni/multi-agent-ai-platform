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

