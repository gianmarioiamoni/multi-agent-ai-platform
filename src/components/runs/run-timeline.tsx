/**
 * Run Timeline Component
 * Displays workflow run execution timeline with all steps
 * Following SRP: Only handles timeline rendering
 */

'use client';

import type { WorkflowRun, AgentRun, ToolInvocation } from '@/types/workflow-execution.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AgentRunStep } from './agent-run-step';

interface RunTimelineProps {
  run: WorkflowRun & {
    workflow_name: string;
    agent_runs: Array<AgentRun & { agent_name: string; tool_invocations: ToolInvocation[] }>;
  };
}

export const RunTimeline = ({ run }: RunTimelineProps) => {
  if (run.agent_runs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-[var(--color-muted-foreground)]">
          No agent runs recorded for this workflow execution.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {run.agent_runs.map((agentRun, index) => (
          <AgentRunStep
            key={agentRun.id}
            agentRun={agentRun}
            stepNumber={agentRun.step_order}
          />
        ))}
      </CardContent>
    </Card>
  );
};

