/**
 * Run Detail Execution Input Component
 * Displays run input
 * Following SRP: Only handles input rendering
 */

interface RunDetailExecutionInputProps {
  input: string;
}

export const RunDetailExecutionInput = ({ input }: RunDetailExecutionInputProps) => {
  return (
    <div>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Input</p>
      <p className="text-sm bg-[var(--color-muted)] p-3 rounded border border-[var(--color-border)]">
        {input}
      </p>
    </div>
  );
};

