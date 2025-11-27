/**
 * Agent Card Footer Test Button Component
 * Client component wrapper for test button with stopPropagation
 * Following SRP: Only handles click event with stopPropagation
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AgentCardFooterTestButtonProps {
  agentId: string;
}

export const AgentCardFooterTestButton = ({ agentId }: AgentCardFooterTestButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <Link href={`/app/agents/${agentId}/test`} onClick={handleClick}>
      <Button variant="outline" size="sm">
        Test Agent
      </Button>
    </Link>
  );
};

