/**
 * Agent Status Badge Component
 * Displays agent status with color coding
 * Following SRP: Only handles status badge rendering
 */

import type { AgentStatus } from '@/types/agent.types';

interface AgentStatusBadgeProps {
  status: AgentStatus;
}

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  archived: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export const AgentStatusBadge = ({ status }: AgentStatusBadgeProps) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-md border ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};

