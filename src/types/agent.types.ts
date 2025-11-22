/**
 * Agent Types
 * Type definitions for AI agents
 */

// AI Model options
export type AIModel = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-3.5-turbo';

// Agent status
export type AgentStatus = 'active' | 'inactive' | 'archived';

// Available tools
export type ToolId = 'web_search' | 'email' | 'calendar' | 'db_ops';

// Agent configuration
export interface AgentConfig {
  // Extensible config object
  [key: string]: unknown;
}

// Agent from database
export interface Agent {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  role: string; // System prompt
  model: AIModel;
  temperature: number;
  max_tokens: number;
  tools_enabled: ToolId[];
  config: AgentConfig;
  status: AgentStatus;
  created_at: string;
  updated_at: string;
}

// Agent creation payload
export interface CreateAgentInput {
  name: string;
  description?: string;
  role: string;
  model: AIModel;
  temperature?: number;
  max_tokens?: number;
  tools_enabled?: ToolId[];
  config?: AgentConfig;
}

// Agent update payload
export interface UpdateAgentInput {
  name?: string;
  description?: string | null;
  role?: string;
  model?: AIModel;
  temperature?: number;
  max_tokens?: number;
  tools_enabled?: ToolId[];
  config?: AgentConfig;
  status?: AgentStatus;
}

// Agent list item (for list views)
export interface AgentListItem {
  id: string;
  name: string;
  description: string | null;
  model: AIModel;
  tools_enabled: ToolId[];
  status: AgentStatus;
  created_at: string;
}

// Model display info
export interface ModelInfo {
  id: AIModel;
  name: string;
  description: string;
  maxTokens: number;
  costPer1kTokens: number; // in USD
}

// Available models configuration
export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable model, best for complex tasks',
    maxTokens: 4096,
    costPer1kTokens: 0.03,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient for most tasks',
    maxTokens: 4096,
    costPer1kTokens: 0.015,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Powerful and fast',
    maxTokens: 4096,
    costPer1kTokens: 0.01,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective',
    maxTokens: 4096,
    costPer1kTokens: 0.0015,
  },
];

// Tool display info
export interface ToolInfo {
  id: ToolId;
  name: string;
  description: string;
  icon: string; // Icon name from our icon system
  comingSoon?: boolean;
}

// Available tools configuration
export const AVAILABLE_TOOLS: ToolInfo[] = [
  {
    id: 'web_search',
    name: 'Web Search',
    description: 'Search the web for real-time information',
    icon: 'search',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send and read emails',
    icon: 'email',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Manage calendar events and meetings',
    icon: 'calendar',
    comingSoon: true,
  },
  {
    id: 'db_ops',
    name: 'Database Operations',
    description: 'Query and manipulate database records',
    icon: 'database',
    comingSoon: true,
  },
];

