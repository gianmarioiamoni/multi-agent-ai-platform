/**
 * Agent Execution Actions
 * Server actions for executing agents
 * Following SRP: Only handles agent execution logic
 */

'use server';

import { getCurrentUser } from '@/lib/auth/utils';
import { getAgent } from './actions';
import { orchestrateAgent } from '@/lib/ai/orchestrator';
import type { AgentExecutionResult } from '@/types/orchestrator.types';

/**
 * Execute an agent with a user message
 */
export async function executeAgent(
  agentId: string,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AgentExecutionResult> {
  try {
    // Validate authentication
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: 'Authentication required',
      };
    }

    const agentResult = await getAgent(agentId);
    
    if (agentResult.error || !agentResult.data) {
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: agentResult.error || 'Agent not found',
      };
    }

    const agent = agentResult.data;

    if (agent.owner_id !== user.id) {
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: 'Unauthorized: You do not own this agent',
      };
    }

    // Validate agent status
    if (agent.status !== 'active') {
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: 'Agent is not active',
      };
    }

    // Validate user message
    if (!userMessage || userMessage.trim().length === 0) {
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: 'User message is required',
      };
    }

    const result = await orchestrateAgent(agent, userMessage, conversationHistory);
    return result;
  } catch (error) {
    
    return {
      success: false,
      message: '',
      toolCalls: [],
      totalExecutionTime: 0,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

