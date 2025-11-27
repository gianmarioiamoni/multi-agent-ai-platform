/**
 * Agent Run Step Error Component
 * Displays agent run error
 * Following SRP: Only handles error rendering
 */

interface AgentRunStepErrorProps {
  error: string;
}

export const AgentRunStepError = ({ error }: AgentRunStepErrorProps) => {
  return (
    <div>
      <p className="text-xs text-red-600 dark:text-red-400 mb-1 font-medium">Error</p>
      <p className="text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 whitespace-pre-wrap">
        {error}
      </p>
    </div>
  );
};

