/**
 * Agent Run Step Component
 * Displays a single agent run step with tool invocations
 * Following SRP: Only handles agent run step rendering
 */

'use client';

import type { AgentRun, ToolInvocation } from '@/types/workflow-execution.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ToolInvocationItem } from './tool-invocation-item';

interface AgentRunStepProps {
  agentRun: AgentRun & { agent_name: string; tool_invocations: ToolInvocation[] };
  stepNumber: number;
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

export const AgentRunStep = ({ agentRun, stepNumber }: AgentRunStepProps) => {
  return (
    <Card className="border-l-4 border-l-[var(--color-primary)]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
                Step {stepNumber}
              </span>
              <CardTitle className="text-lg">{agentRun.agent_name}</CardTitle>
            </div>
            {agentRun.started_at && agentRun.finished_at && (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Duration: {getDuration(agentRun.started_at, agentRun.finished_at)}
              </p>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium text-white rounded ${statusColors[agentRun.status]}`}
          >
            {statusLabels[agentRun.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {agentRun.input && (
          <div>
            <p className="text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">Input</p>
            <p className="text-sm bg-[var(--color-muted)] p-3 rounded border border-[var(--color-border)] whitespace-pre-wrap">
              {agentRun.input}
            </p>
          </div>
        )}

        {agentRun.output && (
          <div>
            <p className="text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">Output</p>
            <p className="text-sm bg-[var(--color-muted)] p-3 rounded border border-[var(--color-border)] whitespace-pre-wrap">
              {agentRun.output}
            </p>
          </div>
        )}

        {agentRun.error && (
          <div>
            <p className="text-xs text-red-600 dark:text-red-400 mb-1 font-medium">Error</p>
            <p className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 whitespace-pre-wrap">
              {agentRun.error}
            </p>
          </div>
        )}

        {agentRun.tool_invocations.length > 0 && (
          <div>
            <p className="text-xs text-[var(--color-muted-foreground)] mb-2 font-medium">
              Tool Calls ({agentRun.tool_invocations.length})
            </p>
            <div className="space-y-2">
              {agentRun.tool_invocations.map((invocation) => (
                <ToolInvocationItem key={invocation.id} invocation={invocation} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

