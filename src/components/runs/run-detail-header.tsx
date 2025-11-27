/**
 * Run Detail Header Component
 * Main composition component for run detail header
 * Following SRP: Only handles component composition
 * Server Component - uses utility function for formatting
 */

import type { WorkflowRun, AgentRun, ToolInvocation } from '@/types/workflow-execution.types';
import { formatRunDetailHeaderData } from '@/utils/run-status';
import { RunDetailHeaderTitle } from './run-detail-header/run-detail-header-title';
import { RunDetailHeaderStatus } from './run-detail-header/run-detail-header-status';
import { RunDetailExecutionDetails } from './run-detail-header/run-detail-execution-details';

interface RunDetailHeaderProps {
  run: WorkflowRun & {
    workflow_name: string;
    agent_runs: Array<AgentRun & { agent_name: string; tool_invocations: ToolInvocation[] }>;
  };
}

export const RunDetailHeader = ({ run }: RunDetailHeaderProps) => {
  const { statusColor, statusLabel, duration, formattedStartedAt, formattedFinishedAt } =
    formatRunDetailHeaderData(run);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <RunDetailHeaderTitle workflowName={run.workflow_name} runId={run.id} />
        <RunDetailHeaderStatus statusColor={statusColor} statusLabel={statusLabel} />
      </div>

      <RunDetailExecutionDetails
        startedAt={formattedStartedAt}
        finishedAt={formattedFinishedAt}
        duration={duration}
        input={run.input}
        output={run.output}
        error={run.error}
      />
    </div>
  );
};

