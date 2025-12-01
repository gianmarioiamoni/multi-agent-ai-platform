/**
 * Workflow Detail Content Component
 * Displays workflow steps and configuration
 * Following SRP: Only handles content rendering
 */

import type { Workflow } from '@/types/workflow.types';
import { WorkflowStepsList } from './workflow-steps-list';
import { WorkflowTriggers } from './workflow-triggers';

interface WorkflowDetailContentProps {
  workflow: Workflow;
}

export const WorkflowDetailContent = ({ workflow }: WorkflowDetailContentProps) => {
  return (
    <div className="space-y-6">
      <WorkflowStepsList steps={workflow.graph.steps} />
      <WorkflowTriggers triggers={workflow.graph.triggers} />
    </div>
  );
};

