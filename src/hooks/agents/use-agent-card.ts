/**
 * Agent Card Hook
 * Handles agent card logic and interactions
 * Following SRP: Only manages agent card logic
 */

'use client';

import { useRouter } from 'next/navigation';
import { AVAILABLE_MODELS, AVAILABLE_TOOLS } from '@/types/agent.types';
import type { AgentListItem } from '@/types/agent.types';
import { getAgentStatusColor } from '@/utils/entity-status';

interface UseAgentCardProps {
  agent: AgentListItem;
}

interface UseAgentCardReturn {
  modelInfo: { id: string; name: string; description: string } | undefined;
  enabledTools: Array<{ id: string; name: string; description: string }>;
  statusColor: string;
  handleCardClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Hook for managing agent card logic
 */
export function useAgentCard({ agent }: UseAgentCardProps): UseAgentCardReturn {
  const router = useRouter();

  const modelInfo = AVAILABLE_MODELS.find((m) => m.id === agent.model);
  
  const enabledTools = agent.tools_enabled
    .map((toolId) => AVAILABLE_TOOLS.find((t) => t.id === toolId))
    .filter(Boolean) as Array<{ id: string; name: string; description: string }>;

  const statusColor = getAgentStatusColor(agent.status);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking on the button
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    router.push(`/app/agents/${agent.id}`);
  };

  return {
    modelInfo,
    enabledTools,
    statusColor,
    handleCardClick,
  };
}

