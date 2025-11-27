/**
 * Agent Run Step Hook
 * Handles agent run step logic and formatting
 * Following SRP: Only manages agent run step logic
 */

import type { AgentRun } from '@/types/workflow-execution.types';

interface UseAgentRunStepProps {
  agentRun: AgentRun;
}

interface UseAgentRunStepReturn {
  statusColor: string;
  statusLabel: string;
  duration: string;
}

const statusColors = {
  pending: 'bg-gray-500',
  running: 'bg-blue-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  skipped: 'bg-orange-500',
};

const statusLabels = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  skipped: 'Skipped',
};

const getDuration = (startedAt: string | null, finishedAt: string | null): string => {
  if (!startedAt || !finishedAt) return '—';

  const start = new Date(startedAt);
  const end = new Date(finishedAt);
  const diffMs = end.getTime() - start.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin}m ${diffSec % 60}s`;
};

/**
 * Hook for managing agent run step logic
 */
export function useAgentRunStep({ agentRun }: UseAgentRunStepProps): UseAgentRunStepReturn {
  const statusColor = statusColors[agentRun.status] || statusColors.pending;
  const statusLabel = statusLabels[agentRun.status] || statusLabels.pending;
  const duration = getDuration(agentRun.started_at, agentRun.finished_at);

  return {
    statusColor,
    statusLabel,
    duration,
  };
}

