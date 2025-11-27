/**
 * Agent Run Step Output Component
 * Displays agent run output
 * Following SRP: Only handles output rendering
 */

interface AgentRunStepOutputProps {
  output: string;
}

export const AgentRunStepOutput = ({ output }: AgentRunStepOutputProps) => {
  return (
    <div>
      <p className="text-xs text-[var(--color-muted-foreground)] mb-1 font-medium">Output</p>
      <p className="text-sm bg-[var(--color-muted)] p-3 rounded border border-[var(--color-border)] whitespace-pre-wrap">
        {output}
      </p>
    </div>
  );
};

