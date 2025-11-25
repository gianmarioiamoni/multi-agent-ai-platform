/**
 * Empty Runs State Component
 * Shows when there are no workflow runs
 * Following SRP: Only handles empty state rendering
 */

'use client';

import { Card } from '@/components/ui/card';

export const EmptyRunsState = () => {
  return (
    <Card className="p-12 text-center">
      <div className="text-6xl mb-4">📊</div>
      <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
        No Workflow Runs Yet
      </h2>
      <p className="text-[var(--color-muted-foreground)]">
        Execute a workflow to see its execution history here
      </p>
    </Card>
  );
};

