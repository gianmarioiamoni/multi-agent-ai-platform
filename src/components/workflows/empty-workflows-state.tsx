/**
 * Empty Workflows State Component
 * Shows when no workflows exist
 * Following SRP: Only handles empty state rendering
 * Server Component - static content with Link only
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const EmptyWorkflowsState = () => {
  return (
    <div className="p-12 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
      <div className="text-6xl mb-4">⚡</div>
      <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
        No Workflows Yet
      </h2>
      <p className="text-[var(--color-muted-foreground)] mb-6 max-w-md mx-auto">
        Create your first multi-agent workflow to automate complex tasks across multiple AI agents.
      </p>
      <Link href="/app/workflows/create">
        <Button variant="primary" size="md">
          Create Your First Workflow
        </Button>
      </Link>
    </div>
  );
};

