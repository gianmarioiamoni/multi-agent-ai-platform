/**
 * Runs Header Component
 * Header for workflow runs page
 * Following SRP: Only handles header rendering
 */

'use client';

export const RunsHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Workflow Runs</h1>
      <p className="text-[var(--color-muted-foreground)] mt-1">
        Monitor and analyze workflow execution history
      </p>
    </div>
  );
};

