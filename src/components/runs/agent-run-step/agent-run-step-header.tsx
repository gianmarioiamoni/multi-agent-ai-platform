/**
 * Agent Run Step Header Component
 * Header with step number, agent name, duration, and status
 * Following SRP: Only handles header rendering
 */

import { CardHeader, CardTitle } from '@/components/ui/card';

interface AgentRunStepHeaderProps {
  stepNumber: number;
  agentName: string;
  duration: string;
  statusColor: string;
  statusLabel: string;
  hasDuration: boolean;
}

export const AgentRunStepHeader = ({
  stepNumber,
  agentName,
  duration,
  statusColor,
  statusLabel,
  hasDuration,
}: AgentRunStepHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-[var(--color-muted-foreground)]">
              Step {stepNumber}
            </span>
            <CardTitle className="text-lg">{agentName}</CardTitle>
          </div>
          {hasDuration ? <p className="text-xs text-[var(--color-muted-foreground)]">Duration: {duration}</p> : null}
        </div>
        <span className={`px-2 py-1 text-xs font-medium text-white rounded ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
    </CardHeader>
  );
};

