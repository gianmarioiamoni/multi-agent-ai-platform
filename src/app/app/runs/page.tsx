/**
 * Runs Page
 * View workflow execution history
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Runs',
  description: 'View workflow execution history',
};

export default function RunsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Runs</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Monitor and analyze workflow executions
        </p>
      </div>

      <div className="p-12 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
          Run History Coming in Sprint 3
        </h2>
        <p className="text-[var(--color-muted-foreground)]">
          Week 6: Workflow run viewer with timeline
        </p>
      </div>
    </div>
  );
}

