/**
 * Agent Utilities
 * Pure utility functions for agent-related formatting
 * These functions can be used in both Server and Client Components
 */

import { AVAILABLE_MODELS, AVAILABLE_TOOLS } from '@/types/agent.types';
import type { AgentListItem } from '@/types/agent.types';
import { getAgentStatusColor } from '@/utils/entity-status';

/**
 * Format agent card data (model info, enabled tools, status color)
 * Pure function - can be used in Server Components
 */
export function formatAgentCardData(agent: AgentListItem): {
  modelInfo: { id: string; name: string; description: string } | undefined;
  enabledTools: Array<{ id: string; name: string; description: string }>;
  statusColor: string;
} {
  const modelInfo = AVAILABLE_MODELS.find((m) => m.id === agent.model);
  
  const enabledTools = agent.tools_enabled
    .map((toolId) => AVAILABLE_TOOLS.find((t) => t.id === toolId))
    .filter(Boolean) as Array<{ id: string; name: string; description: string }>;

  const statusColor = getAgentStatusColor(agent.status);

  return {
    modelInfo,
    enabledTools,
    statusColor,
  };
}

