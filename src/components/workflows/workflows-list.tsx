/**
 * Workflows List Component
 * Grid of workflow cards
 * Following SRP: Only handles list rendering
 * Server Component - maps props to WorkflowCard components
 */

import type { WorkflowListItem } from '@/types/workflow.types';
import { WorkflowCard } from './workflow-card';

interface WorkflowsListProps {
  workflows: WorkflowListItem[];
}

export const WorkflowsList = ({ workflows }: WorkflowsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
};

