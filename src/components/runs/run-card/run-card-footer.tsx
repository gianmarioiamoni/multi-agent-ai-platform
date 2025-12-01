/**
 * Run Card Footer Component
 * Footer with start date and duration
 * Following SRP: Only handles footer rendering
 */

import { formatDate } from '@/utils/format';

interface RunCardFooterProps {
  startedAt: string | null;
  duration: string;
}

export const RunCardFooter = ({ startedAt, duration }: RunCardFooterProps) => {
  return (
    <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
      <span>Started {startedAt ? formatDate(startedAt) : '—'}</span>
      {startedAt && duration !== '—' ? <span>Duration: {duration}</span> : null}
    </div>
  );
};

