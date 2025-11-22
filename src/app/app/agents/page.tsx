/**
 * Agents Page
 * Main page for viewing and managing AI agents
 */

import { getAgents } from '@/lib/agents/actions';
import { AgentsHeader } from '@/components/agents/agents-header';
import { AgentsList } from '@/components/agents/agents-list';
import { EmptyAgentsState } from '@/components/agents/empty-agents-state';

export default async function AgentsPage() {
  const { data: agents, error } = await getAgents();

  if (error) {
    return (
      <div className="container mx-auto">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading agents</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const hasAgents = agents && agents.length > 0;

  return (
    <div className="container mx-auto">
      <AgentsHeader />
      
      {hasAgents ? (
        <AgentsList agents={agents} />
      ) : (
        <EmptyAgentsState />
      )}
    </div>
  );
}
