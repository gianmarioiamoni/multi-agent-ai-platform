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

    // Get agent
    const agent = await getAgent(agentId);
    if (!agent) {
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: 'Agent not found',
      };
    }

    // Validate ownership
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

    console.log('[Agent Execution] Executing agent:', {
      agentId: agent.id,
      agentName: agent.name,
      userId: user.id,
      messageLength: userMessage.length,
    });

    // Execute agent
    const result = await orchestrateAgent(agent, userMessage, conversationHistory);

    console.log('[Agent Execution] Agent execution completed:', {
      agentId: agent.id,
      success: result.success,
      toolCallsCount: result.toolCalls.length,
      totalExecutionTime: result.totalExecutionTime,
    });

    return result;
  } catch (error) {
    console.error('[Agent Execution] Error:', error);
    
    return {
      success: false,
      message: '',
      toolCalls: [],
      totalExecutionTime: 0,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

