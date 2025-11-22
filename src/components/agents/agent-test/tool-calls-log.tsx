/**
 * Tool Calls Log Component
 * Displays log of tool calls made by the agent
 * Following SRP: Only handles tool calls display
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ToolExecution } from '@/types/orchestrator.types';

interface ToolCallsLogProps {
  toolCalls: ToolExecution[];
}

export const ToolCallsLog = ({ toolCalls }: ToolCallsLogProps) => {
  if (toolCalls.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🔧 Tool Calls ({toolCalls.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {toolCalls.map((toolExecution, index) => (
          <div
            key={toolExecution.call.id || index}
            className={`rounded-lg p-4 border ${
              toolExecution.result.success
                ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20'
                : 'bg-[var(--color-destructive)]/5 border-[var(--color-destructive)]/20'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    toolExecution.result.success
                      ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                      : 'bg-[var(--color-destructive)]/20 text-[var(--color-destructive)]'
                  }`}
                >
                  {toolExecution.call.toolId}
                </span>
                {toolExecution.result.success ? (
                  <span className="text-xs text-green-500">✅ Success</span>
                ) : (
                  <span className="text-xs text-red-500">❌ Failed</span>
                )}
              </div>
              <span className="text-xs text-[var(--color-muted-foreground)]">
                {toolExecution.executionTime}ms
              </span>
            </div>

            {/* Tool Parameters */}
            <div className="mb-2">
              <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1">
                Parameters:
              </p>
              <pre className="text-xs bg-[var(--color-background)] p-2 rounded overflow-x-auto">
                {JSON.stringify(toolExecution.call.params, null, 2)}
              </pre>
            </div>

            {/* Tool Result */}
            {toolExecution.result.success && toolExecution.result.data && (
              <div>
                <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1">
                  Result:
                </p>
                <pre className="text-xs bg-[var(--color-background)] p-2 rounded overflow-x-auto max-h-40 overflow-y-auto">
                  {JSON.stringify(toolExecution.result.data, null, 2)}
                </pre>
              </div>
            )}

            {/* Tool Error */}
            {!toolExecution.result.success && toolExecution.result.error && (
              <div>
                <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1">
                  Error:
                </p>
                <p className="text-xs text-[var(--color-destructive)]">
                  {toolExecution.result.error}
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

