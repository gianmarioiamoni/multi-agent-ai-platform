/**
 * Agents Page
 * List and manage AI agents
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agents',
  description: 'Manage your AI agents',
};

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Agents</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Create and manage your AI agents
        </p>
      </div>

      <div className="p-12 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
          Agents Coming in Sprint 2
        </h2>
        <p className="text-[var(--color-muted-foreground)]">
          Week 3: Agent creation and management features
        </p>
      </div>
    </div>
  );
}

