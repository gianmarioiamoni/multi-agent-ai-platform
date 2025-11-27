/**
 * Agent Card Component
 * Main composition component for agent card
 * Following SRP: Only handles component composition
 * Server Component - static content only
 * Note: Wrapped by AgentCardWrapper (client) for navigation
 */

import { Card, CardContent } from '@/components/ui/card';
import { formatAgentCardData } from '@/utils/agent-utils';
import { AgentCardHeader } from './agent-card/agent-card-header';
import { AgentCardModelInfo } from './agent-card/agent-card-model-info';
import { AgentCardTools } from './agent-card/agent-card-tools';
import { AgentCardFooter } from './agent-card/agent-card-footer';
// Note: All subcomponents (Header, ModelInfo, Tools, Footer) are Server Components
import type { AgentListItem } from '@/types/agent.types';

interface AgentCardProps {
  agent: AgentListItem;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const { modelInfo, enabledTools, statusColor } = formatAgentCardData(agent);

  return (
    <Card className="h-full border-2 border-[var(--color-border)] hover:!border-[var(--color-primary)] hover:shadow-lg transition-all cursor-pointer group">
      <AgentCardHeader
        name={agent.name}
        description={agent.description}
        status={agent.status}
        statusColor={statusColor}
      />

      <CardContent>
        <div className="space-y-3">
          <AgentCardModelInfo modelName={modelInfo?.name || agent.model} />

          <AgentCardTools tools={enabledTools} />
        </div>
      </CardContent>

      <AgentCardFooter
        createdAt={agent.created_at}
        agentId={agent.id}
        status={agent.status}
      />
    </Card>
  );
};
