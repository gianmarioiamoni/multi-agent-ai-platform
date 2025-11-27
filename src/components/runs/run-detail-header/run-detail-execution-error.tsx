/**
 * Run Detail Execution Error Component
 * Displays run error
 * Following SRP: Only handles error rendering
 */

interface RunDetailExecutionErrorProps {
  error: string;
}

export const RunDetailExecutionError = ({
  error,
}: RunDetailExecutionErrorProps) => {
  return (
    <div>
      <p className="text-sm text-red-600 dark:text-red-400 mb-1">Error</p>
      <p className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 whitespace-pre-wrap">
        {error}
      </p>
    </div>
  );
};

