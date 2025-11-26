/**
 * Agent Test Client Component
 * Client component for testing an agent
 * Following SRP: Only handles agent test UI orchestration
 */

'use client';

import { useAgentExecution } from '@/hooks/agents/use-agent-execution';
import { AgentTestForm } from './agent-test-form';
import { AgentResponse } from './agent-response';
import { ToolCallsLog } from './tool-calls-log';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AgentTestClientProps {
  agentId: string;
  agentName: string;
}

export const AgentTestClient = ({ agentId, agentName }: AgentTestClientProps) => {
  const { execute, result, isLoading, error, reset } = useAgentExecution(agentId);

  const hasResult = result !== null;
  const hasError = error !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Test Agent</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Test agent <span className="font-semibold">{agentName}</span> by sending messages and
          viewing responses.
        </p>
      </div>

      {/* Error Display */}
      {hasError && !result && (
        <Card className="border-[var(--color-destructive)]">
          <CardHeader>
            <CardTitle className="text-lg text-[var(--color-destructive)]">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-destructive)]">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Test Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
          <CardDescription>
            Enter a message to test the agent. The agent will use enabled tools if needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentTestForm onSubmit={execute} isLoading={isLoading} disabled={hasError} />
        </CardContent>
      </Card>

      {/* Reset Button */}
      {hasResult && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={reset}>
            Clear Results
          </Button>
        </div>
      )}

      {/* Agent Response */}
      {result && (
        <AgentResponse
          message={result.message}
          success={result.success}
          executionTime={result.totalExecutionTime}
        />
      )}

      {/* Tool Calls Log */}
      {result && result.toolCalls.length > 0 && (
        <ToolCallsLog toolCalls={result.toolCalls} />
      )}

      {/* Execution Summary */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Execution Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--color-muted-foreground)]">Status</p>
                <p className="font-semibold text-[var(--color-foreground)]">
                  {result.success ? '✅ Success' : '❌ Failed'}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-muted-foreground)]">Total Time</p>
                <p className="font-semibold text-[var(--color-foreground)]">
                  {result.totalExecutionTime}ms
                </p>
              </div>
              <div>
                <p className="text-[var(--color-muted-foreground)]">Tool Calls</p>
                <p className="font-semibold text-[var(--color-foreground)]">
                  {result.toolCalls.length}
                </p>
              </div>
              <div>
                <p className="text-[var(--color-muted-foreground)]">Successful Tools</p>
                <p className="font-semibold text-[var(--color-foreground)]">
                  {result.toolCalls.filter((tc) => tc.result.success).length} /{' '}
                  {result.toolCalls.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

