/**
 * Agent Response Component
 * Displays agent execution response
 * Following SRP: Only handles response display
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AgentResponseProps {
  message: string;
  success: boolean;
  executionTime: number;
}

export const AgentResponse = ({ message, success, executionTime }: AgentResponseProps) => {
  if (!message) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {success ? '✅ Agent Response' : '❌ Error'}
          </CardTitle>
          <span className="text-xs text-[var(--color-muted-foreground)]">
            {executionTime}ms
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`rounded-lg p-4 ${
            success
              ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20'
              : 'bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap text-[var(--color-foreground)]">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

