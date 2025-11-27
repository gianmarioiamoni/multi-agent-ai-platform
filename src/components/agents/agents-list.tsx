/**
 * Agents List Component
 * Grid of agent cards
 * Following SRP: Only handles list rendering
 * Server Component - maps props to AgentCard components
 * Note: AgentCard remains client-side due to useRouter for navigation
 */

import type { AgentListItem } from '@/types/agent.types';
import { AgentCard } from './agent-card';

interface AgentsListProps {
  agents: AgentListItem[];
}

export const AgentsList = ({ agents }: AgentsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

