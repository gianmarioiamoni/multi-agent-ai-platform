/**
 * Agent Run Step Input Component
 * Displays agent run input
 * Following SRP: Only handles input rendering
 */

interface AgentRunStepInputProps {
  input: string;
}

export const AgentRunStepInput = ({ input }: AgentRunStepInputProps) => {
  return (
    <div>
      <p className="text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">Input</p>
      <p className="text-sm bg-[var(--color-muted)] p-3 rounded border border-[var(--color-border)] whitespace-pre-wrap">
        {input}
      </p>
    </div>
  );
};

