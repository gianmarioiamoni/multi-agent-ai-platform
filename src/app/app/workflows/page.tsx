/**
 * Workflows Page
 * List and manage workflows
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workflows',
  description: 'Manage your workflows',
};

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Workflows</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Build and automate multi-agent workflows
        </p>
      </div>

      <div className="p-12 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
        <div className="text-6xl mb-4">⚡</div>
        <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
          Workflows Coming in Sprint 3
        </h2>
        <p className="text-[var(--color-muted-foreground)]">
          Week 5: Multi-agent workflow engine and builder
        </p>
      </div>
    </div>
  );
}

