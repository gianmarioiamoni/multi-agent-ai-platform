/**
 * Agent Card Component
 * Main composition component for agent card
 * Following SRP: Only handles component composition
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useAgentCard } from '@/hooks/agents/use-agent-card';
import { AgentCardHeader } from './agent-card/agent-card-header';
import { AgentCardModelInfo } from './agent-card/agent-card-model-info';
import { AgentCardTools } from './agent-card/agent-card-tools';
import { AgentCardFooter } from './agent-card/agent-card-footer';
import type { AgentListItem } from '@/types/agent.types';

interface AgentCardProps {
  agent: AgentListItem;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const { modelInfo, enabledTools, statusColor, handleCardClick } = useAgentCard({ agent });

  return (
    <Card
      className="h-full border-2 border-[var(--color-border)] hover:!border-[var(--color-primary)] hover:shadow-lg transition-all cursor-pointer group"
      onClick={handleCardClick}
    >
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
