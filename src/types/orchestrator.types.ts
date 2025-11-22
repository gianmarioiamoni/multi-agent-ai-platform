/**
 * Orchestrator Types
 * Type definitions for agent orchestration
 */

import type { Agent, ToolId } from './agent.types';
import type { ToolResult } from './tool.types';

// Tool call from OpenAI
export interface ToolCall {
  id: string;
  toolId: ToolId;
  params: Record<string, unknown>;
}

// Tool execution result with call info
export interface ToolExecution {
  call: ToolCall;
  result: ToolResult;
  executionTime: number;
}

// Agent execution result
export interface AgentExecutionResult {
  success: boolean;
  message: string;
  toolCalls: ToolExecution[];
  totalExecutionTime: number;
  error?: string;
}

// Orchestrator input
export interface OrchestratorInput {
  agent: Agent;
  userMessage: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

// OpenAI message types
export type OpenAIMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string }
  | {
      role: 'assistant';
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }>;
    }
  | {
      role: 'tool';
      content: string;
      tool_call_id: string;
    };

