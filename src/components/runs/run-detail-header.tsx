/**
 * Run Detail Header Component
 * Header with run information and status
 * Following SRP: Only handles header rendering
 */

'use client';

import Link from 'next/link';
import type { WorkflowRun, AgentRun, ToolInvocation } from '@/types/workflow-execution.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format';

interface RunDetailHeaderProps {
  run: WorkflowRun & {
    workflow_name: string;
    agent_runs: Array<AgentRun & { agent_name: string; tool_invocations: ToolInvocation[] }>;
  };
}

import { getRunStatusColor, getRunStatusLabel } from '@/utils/run-status';

const getDuration = (startedAt: string | null, finishedAt: string | null): string => {
  if (!startedAt || !finishedAt) return '—';
  
  const start = new Date(startedAt);
  const end = new Date(finishedAt);
  const diffMs = end.getTime() - start.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ${diffSec % 60}s`;
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ${diffMin % 60}m ${diffSec % 60}s`;
};

export const RunDetailHeader = ({ run }: RunDetailHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/app/runs">
              <Button variant="ghost" size="sm">
                ← Back to Runs
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
              {run.workflow_name}
            </h1>
          </div>
          <p className="text-[var(--color-muted-foreground)]">
            Run ID: {run.id}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium text-white rounded ${getRunStatusColor(run.status)}`}
        >
          {getRunStatusLabel(run.status)}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Started</p>
              <p className="text-sm font-medium">
                {run.started_at ? formatDate(run.started_at) : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Finished</p>
              <p className="text-sm font-medium">
                {run.finished_at ? formatDate(run.finished_at) : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Duration</p>
              <p className="text-sm font-medium">
                {getDuration(run.started_at, run.finished_at)}
              </p>
            </div>
          </div>

          {run.input && (
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Input</p>
              <p className="text-sm bg-[var(--color-muted)] p-3 rounded border border-[var(--color-border)]">
                {run.input}
              </p>
            </div>
          )}

          {run.output && (
            <div>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Output</p>
              <p className="text-sm bg-[var(--color-muted)] p-3 rounded border border-[var(--color-border)] whitespace-pre-wrap">
                {run.output}
              </p>
            </div>
          )}

          {run.error && (
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Error</p>
              <p className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 whitespace-pre-wrap">
                {run.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

