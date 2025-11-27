/**
 * Agent Card Hook
 * Handles agent card logic and interactions
 * Following SRP: Only manages agent card logic
 */

'use client';

import { useRouter } from 'next/navigation';
import { AVAILABLE_MODELS, AVAILABLE_TOOLS } from '@/types/agent.types';
import type { AgentListItem } from '@/types/agent.types';

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

  const statusColor = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    archived: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  }[agent.status];

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

