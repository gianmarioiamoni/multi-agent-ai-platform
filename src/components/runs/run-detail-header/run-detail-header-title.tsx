/**
 * Run Detail Header Title Component
 * Title section with back button, workflow name, and run ID
 * Following SRP: Only handles title section rendering
 * Server Component - static content with Link only
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface RunDetailHeaderTitleProps {
  workflowName: string;
  runId: string;
}

export const RunDetailHeaderTitle = ({
  workflowName,
  runId,
}: RunDetailHeaderTitleProps) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Link href="/app/runs">
          <Button variant="ghost" size="sm">
            ← Back to Runs
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          {workflowName}
        </h1>
      </div>
      <p className="text-[var(--color-muted-foreground)]">Run ID: {runId}</p>
    </div>
  );
};

