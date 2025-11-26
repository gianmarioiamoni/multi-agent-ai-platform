/**
 * Workflow Status Badge Component
 * Displays workflow status with color coding
 * Following SRP: Only handles status badge rendering
 */

import type { WorkflowStatus } from '@/types/workflow.types';

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus;
}

const statusColors = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  archived: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const statusLabels = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
};

export const WorkflowStatusBadge = ({ status }: WorkflowStatusBadgeProps) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-md border ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};

