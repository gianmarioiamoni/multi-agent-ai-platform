/**
 * Workflow Status Badge Component
 * Displays workflow status with color coding
 * Following SRP: Only handles status badge rendering
 */

import type { WorkflowStatus } from '@/types/workflow.types';
import {
  getWorkflowStatusBadgeColor,
  getWorkflowStatusLabel,
} from '@/utils/entity-status';

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus;
}

export const WorkflowStatusBadge = ({ status }: WorkflowStatusBadgeProps) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-md border ${getWorkflowStatusBadgeColor(status)}`}
    >
      {getWorkflowStatusLabel(status)}
    </span>
  );
};

