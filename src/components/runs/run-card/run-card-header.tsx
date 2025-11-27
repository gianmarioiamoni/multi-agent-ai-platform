/**
 * Run Card Header Component
 * Header with workflow name, input preview, and status badge
 * Following SRP: Only handles header rendering
 */

interface RunCardHeaderProps {
  workflowName: string;
  input: string | null;
  statusColor: string;
  statusLabel: string;
}

export const RunCardHeader = ({
  workflowName,
  input,
  statusColor,
  statusLabel,
}: RunCardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors mb-1">
          {workflowName}
        </h3>
        {input && (
          <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mt-1">
            {input}
          </p>
        )}
      </div>
      <span className={`px-2 py-1 text-xs font-medium text-white rounded ${statusColor}`}>
        {statusLabel}
      </span>
    </div>
  );
};

