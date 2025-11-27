/**
 * Agent Run Step Tools Component
 * Displays tool invocations list
 * Following SRP: Only handles tool invocations rendering
 */

import { ToolInvocationItem } from '@/components/runs/tool-invocation-item';
import type { ToolInvocation } from '@/types/workflow-execution.types';

interface AgentRunStepToolsProps {
  toolInvocations: ToolInvocation[];
}

export const AgentRunStepTools = ({ toolInvocations }: AgentRunStepToolsProps) => {
  if (toolInvocations.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs text-[var(--color-muted-foreground)] mb-2 font-medium">
        Tool Calls ({toolInvocations.length})
      </p>
      <div className="space-y-2">
        {toolInvocations.map((invocation) => (
          <ToolInvocationItem key={invocation.id} invocation={invocation} />
        ))}
      </div>
    </div>
  );
};

