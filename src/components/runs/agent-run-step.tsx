/**
 * Agent Run Step Component
 * Main composition component for agent run step
 * Following SRP: Only handles component composition
 */

'use client';

import type { AgentRun, ToolInvocation } from '@/types/workflow-execution.types';
import { Card, CardContent } from '@/components/ui/card';
import { useAgentRunStep } from '@/hooks/runs/use-agent-run-step';
import { AgentRunStepHeader } from './agent-run-step/agent-run-step-header';
import { AgentRunStepInput } from './agent-run-step/agent-run-step-input';
import { AgentRunStepOutput } from './agent-run-step/agent-run-step-output';
import { AgentRunStepError } from './agent-run-step/agent-run-step-error';
import { AgentRunStepTools } from './agent-run-step/agent-run-step-tools';

interface AgentRunStepProps {
  agentRun: AgentRun & { agent_name: string; tool_invocations: ToolInvocation[] };
  stepNumber: number;
}

export const AgentRunStep = ({ agentRun, stepNumber }: AgentRunStepProps) => {
  const { statusColor, statusLabel, duration } = useAgentRunStep({ agentRun });

  const hasDuration = Boolean(agentRun.started_at && agentRun.finished_at);

  return (
    <Card className="border-l-4 border-l-[var(--color-primary)]">
      <AgentRunStepHeader
        stepNumber={stepNumber}
        agentName={agentRun.agent_name}
        duration={duration}
        statusColor={statusColor}
        statusLabel={statusLabel}
        hasDuration={hasDuration}
      />

      <CardContent className="space-y-4">
        {agentRun.input && <AgentRunStepInput input={agentRun.input} />}

        {agentRun.output && <AgentRunStepOutput output={agentRun.output} />}

        {agentRun.error && <AgentRunStepError error={agentRun.error} />}

        <AgentRunStepTools toolInvocations={agentRun.tool_invocations} />
      </CardContent>
    </Card>
  );
};

