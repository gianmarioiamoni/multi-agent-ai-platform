/**
 * Agent Status Badge Component
 * Displays agent status with color coding
 * Following SRP: Only handles status badge rendering
 */

import type { AgentStatus } from '@/types/agent.types';
import { getAgentStatusColor, getAgentStatusLabel } from '@/utils/entity-status';

interface AgentStatusBadgeProps {
  status: AgentStatus;
}

export const AgentStatusBadge = ({ status }: AgentStatusBadgeProps) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-md border ${getAgentStatusColor(status)}`}
    >
      {getAgentStatusLabel(status)}
    </span>
  );
};

