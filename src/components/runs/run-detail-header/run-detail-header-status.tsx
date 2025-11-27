/**
 * Run Detail Header Status Component
 * Status badge for run detail header
 * Following SRP: Only handles status badge rendering
 */

interface RunDetailHeaderStatusProps {
  statusColor: string;
  statusLabel: string;
}

export const RunDetailHeaderStatus = ({
  statusColor,
  statusLabel,
}: RunDetailHeaderStatusProps) => {
  return (
    <span
      className={`px-3 py-1 text-sm font-medium text-white rounded ${statusColor}`}
    >
      {statusLabel}
    </span>
  );
};

