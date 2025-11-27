/**
 * Run Detail Execution Grid Component
 * Grid showing started, finished, and duration
 * Following SRP: Only handles execution grid rendering
 */

interface RunDetailExecutionGridProps {
  startedAt: string;
  finishedAt: string;
  duration: string;
}

export const RunDetailExecutionGrid = ({
  startedAt,
  finishedAt,
  duration,
}: RunDetailExecutionGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Started</p>
        <p className="text-sm font-medium">{startedAt}</p>
      </div>
      <div>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Finished</p>
        <p className="text-sm font-medium">{finishedAt}</p>
      </div>
      <div>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-1">Duration</p>
        <p className="text-sm font-medium">{duration}</p>
      </div>
    </div>
  );
};

