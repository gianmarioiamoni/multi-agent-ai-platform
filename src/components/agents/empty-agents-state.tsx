/**
 * Empty Agents State Component
 * Displayed when user has no agents
 * Following SRP: Only handles empty state rendering
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const EmptyAgentsState = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <svg
          className="w-16 h-16 text-muted-foreground mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        
        <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Create your first AI agent to start automating tasks. Agents can use
          tools like web search, email, calendar, and database operations.
        </p>
        
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
            Create Your First Agent
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

