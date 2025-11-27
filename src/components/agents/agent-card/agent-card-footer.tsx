/**
 * Agent Card Footer Component
 * Footer with creation date and test button
 * Following SRP: Only handles footer rendering
 * Server Component - Link is SSR-safe, stopPropagation handled in parent
 */

import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format';
import { AgentCardFooterTestButton } from './agent-card-footer-test-button';

interface AgentCardFooterProps {
  createdAt: string;
  agentId: string;
  status: string;
}

export const AgentCardFooter = ({ createdAt, agentId, status }: AgentCardFooterProps) => {
  return (
    <CardFooter className="flex items-center justify-between pt-4 border-t border-border">
      <div className="text-xs text-muted-foreground">
        Created {formatDate(createdAt)}
      </div>
      {status === 'active' && (
        <AgentCardFooterTestButton agentId={agentId} />
      )}
    </CardFooter>
  );
};

