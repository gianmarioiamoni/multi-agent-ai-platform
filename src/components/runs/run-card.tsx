/**
 * Run Card Component
 * Main composition component for run card
 * Following SRP: Only handles component composition
 * Server Component - static content with Link only
 */

import Link from 'next/link';
import type { WorkflowRun } from '@/types/workflow-execution.types';
import { Card } from '@/components/ui/card';
import { formatRunCardData } from '@/utils/run-status';
import { RunCardHeader } from './run-card/run-card-header';
import { RunCardFooter } from './run-card/run-card-footer';

interface RunCardProps {
  run: WorkflowRun & { workflow_name: string };
}

export const RunCard = ({ run }: RunCardProps) => {
  const { statusColor, statusLabel, duration } = formatRunCardData(run);

  return (
    <Link href={`/app/runs/${run.id}`}>
      <Card className="h-full border-2 border-[var(--color-border)] hover:!border-[var(--color-primary)] hover:shadow-lg transition-all cursor-pointer group p-6">
        <RunCardHeader
          workflowName={run.workflow_name}
          input={run.input}
          statusColor={statusColor}
          statusLabel={statusLabel}
        />

        <RunCardFooter startedAt={run.started_at} duration={duration} />
      </Card>
    </Link>
  );
};

