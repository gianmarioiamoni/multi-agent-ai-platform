/**
 * Runs List Component
 * Displays list of workflow runs
 * Following SRP: Only handles list rendering
 * Server Component - maps props to RunCard components
 */

import type { WorkflowRun } from '@/types/workflow-execution.types';
import { RunCard } from './run-card';

interface RunsListProps {
  runs: Array<WorkflowRun & { workflow_name: string }>;
}

export const RunsList = ({ runs }: RunsListProps) => {
  if (runs.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {runs.map((run) => (
        <RunCard key={run.id} run={run} />
      ))}
    </div>
  );
};

