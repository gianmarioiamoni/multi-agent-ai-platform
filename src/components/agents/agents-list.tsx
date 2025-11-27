/**
 * Agents List Component
 * Grid of agent cards
 * Following SRP: Only handles list rendering
 * Server Component - maps props to AgentCardWrapper components
 * Note: AgentCard is SSR, wrapped by AgentCardWrapper (client) for navigation
 */

import type { AgentListItem } from '@/types/agent.types';
import { AgentCardWrapper } from './agent-card-wrapper';

interface AgentsListProps {
  agents: AgentListItem[];
}

export const AgentsList = ({ agents }: AgentsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCardWrapper key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

