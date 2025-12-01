/**
 * Tool Invocation Item Component
 * Displays a single tool invocation
 * Following SRP: Only handles tool invocation rendering
 */

'use client';

import type { ToolInvocation } from '@/types/workflow-execution.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ToolInvocationItemProps {
  invocation: ToolInvocation;
}

import { getRunStatusColor, getRunStatusLabel } from '@/utils/run-status';

export const ToolInvocationItem = ({ invocation }: ToolInvocationItemProps) => {
  return (
    <Card className="ml-8 mt-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            🔧 {invocation.tool}
          </CardTitle>
          <span
            className={`px-2 py-0.5 text-xs font-medium text-white rounded ${getRunStatusColor(invocation.status)}`}
          >
            {getRunStatusLabel(invocation.status)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Parameters</p>
          <pre className="text-xs bg-[var(--color-muted)] p-2 rounded border border-[var(--color-border)] overflow-x-auto">
            {JSON.stringify(invocation.params, null, 2)}
          </pre>
        </div>

        {invocation.result ? <div>
            <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Result</p>
            <pre className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800 overflow-x-auto max-h-48 overflow-y-auto">
              {JSON.stringify(invocation.result, null, 2)}
            </pre>
          </div> : null}

        {invocation.error ? <div>
            <p className="text-xs text-red-600 dark:text-red-400 mb-1">Error</p>
            <p className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 whitespace-pre-wrap">
              {invocation.error}
            </p>
          </div> : null}

        {invocation.execution_time_ms !== null ? <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)]">
            <span>Execution time: {invocation.execution_time_ms}ms</span>
            {invocation.started_at && invocation.finished_at ? <span>
                {new Date(invocation.started_at).toLocaleTimeString()} -{' '}
                {new Date(invocation.finished_at).toLocaleTimeString()}
              </span> : null}
          </div> : null}
      </CardContent>
    </Card>
  );
};

