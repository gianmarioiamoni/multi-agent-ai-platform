/**
 * Run Detail Execution Output Component
 * Displays run output
 * Following SRP: Only handles output rendering
 */

interface RunDetailExecutionOutputProps {
  output: string;
}

export const RunDetailExecutionOutput = ({
  output,
}: RunDetailExecutionOutputProps) => {
  return (
    <div>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Output</p>
      <p className="text-sm bg-[var(--color-muted)] p-3 rounded border border-[var(--color-border)] whitespace-pre-wrap">
        {output}
      </p>
    </div>
  );
};

