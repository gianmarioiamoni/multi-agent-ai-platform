/**
 * Agent Card Wrapper Component
 * Minimal client wrapper for agent card navigation
 * Following SRP: Only handles click navigation
 * Note: AgentCard is SSR, this wrapper adds client-side navigation
 */

'use client';

import { useRouter } from 'next/navigation';
import type { AgentListItem } from '@/types/agent.types';
import { AgentCard } from './agent-card';

interface AgentCardWrapperProps {
  agent: AgentListItem;
}

export const AgentCardWrapper = ({ agent }: AgentCardWrapperProps) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking on a link or button
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    router.push(`/app/agents/${agent.id}`);
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <AgentCard agent={agent} />
    </div>
  );
};

