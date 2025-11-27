/**
 * Workflows Header Component
 * Header with title and create button
 * Following SRP: Only handles header rendering
 * Server Component - static content with Link only
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const WorkflowsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Workflows</h1>
        <p className="text-muted-foreground mt-1">
          Build and automate multi-agent workflows
        </p>
      </div>
      
      <Link href="/app/workflows/create">
        <Button variant="primary" size="md" className="md:px-4">
          <svg
            className="w-5 h-5 md:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden md:inline">Create Workflow</span>
        </Button>
      </Link>
    </div>
  );
};

