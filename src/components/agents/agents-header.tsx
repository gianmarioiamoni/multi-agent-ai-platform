/**
 * Agents Header Component
 * Header with title and create button
 * Following SRP: Only handles header rendering
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const AgentsHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">AI Agents</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage your AI agents with custom roles and tools
        </p>
      </div>
      
      <Link href="/app/agents/create">
        <Button variant="primary" size="md">
          <svg
            className="w-5 h-5 mr-2"
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
          Create Agent
        </Button>
      </Link>
    </div>
  );
};

