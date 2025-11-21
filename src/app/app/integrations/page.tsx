/**
 * Integrations Page
 * Manage external service integrations
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Manage external service integrations',
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Integrations</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Connect external services and tools
        </p>
      </div>

      <div className="p-12 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
        <div className="text-6xl mb-4">🔌</div>
        <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
          Integrations Coming in Sprint 3
        </h2>
        <p className="text-[var(--color-muted-foreground)]">
          Week 6: Google Calendar, Email, Database tools
        </p>
      </div>
    </div>
  );
}

