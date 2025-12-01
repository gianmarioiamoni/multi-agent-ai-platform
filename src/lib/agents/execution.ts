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
import { checkRateLimit } from '@/lib/rate-limiting/rate-limiter';
import { createUserFriendlyError } from '@/lib/errors/error-handler';
import { createScopedLogger } from '@/lib/logging/scoped-logger';

/**
 * Execute an agent with a user message
 */
export async function executeAgent(
  agentId: string,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AgentExecutionResult> {
  const startTime = Date.now();
  const requestId = `agent-exec-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const logger = createScopedLogger({
    category: 'agent.execution',
    agentId,
    requestId,
  });

  try {
    // Validate authentication
    const user = await getCurrentUser();
    if (!user) {
      const errorDetails = createUserFriendlyError(
        new Error('Authentication required'),
        'authentication',
        { agentId }
      );
      await logger.error('Agent execution failed: authentication required', new Error('Authentication required'));
      
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: errorDetails.userMessage,
      };
    }

    await logger.info('Starting agent execution', { userId: user.id, agentId, messageLength: userMessage.length });

    const agentResult = await getAgent(agentId);
    
    if (agentResult.error || !agentResult.data) {
      const errorDetails = createUserFriendlyError(
        new Error(agentResult.error || 'Agent not found'),
        'not_found',
        { agentId, userId: user.id }
      );
      await logger.error('Agent not found', new Error(agentResult.error || 'Agent not found'));
      
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: errorDetails.userMessage,
      };
    }

    const agent = agentResult.data;

    if (agent.owner_id !== user.id) {
      const errorDetails = createUserFriendlyError(
        new Error('Unauthorized: You do not own this agent'),
        'authorization',
        { agentId, agentOwnerId: agent.owner_id, userId: user.id }
      );
      await logger.warn('Unauthorized agent access attempt', { agentId, agentOwnerId: agent.owner_id, userId: user.id });
      
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: errorDetails.userMessage,
      };
    }

    // Validate agent status
    if (agent.status !== 'active') {
      const errorDetails = createUserFriendlyError(
        new Error('Agent is not active'),
        'validation',
        { agentId, status: agent.status }
      );
      await logger.warn('Attempt to execute inactive agent', { agentId, status: agent.status });
      
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: errorDetails.userMessage,
      };
    }

    // Validate user message
    if (!userMessage || userMessage.trim().length === 0) {
      const errorDetails = createUserFriendlyError(
        new Error('User message is required'),
        'validation',
        { agentId }
      );
      await logger.warn('Empty user message provided', { agentId });
      
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: errorDetails.userMessage,
      };
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(user.id, 'agent:execute');

    if (!rateLimitResult.allowed) {
      const resetInMinutes = Math.ceil(
        (rateLimitResult.resetAt.getTime() - Date.now()) / 1000 / 60
      );
      const errorDetails = createUserFriendlyError(
        new Error(`Rate limit exceeded. Please try again in ${resetInMinutes} minute(s).`),
        'rate_limit',
        { userId: user.id, agentId }
      );
      await logger.warn('Rate limit exceeded', { userId: user.id, agentId, remaining: rateLimitResult.remaining });
      
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: 0,
        error: errorDetails.userMessage,
      };
    }

    await logger.info('Orchestrating agent', { agentId, agentName: agent.name, toolsEnabled: agent.tools_enabled });
    const result = await orchestrateAgent(agent, userMessage, conversationHistory);
    
    const duration = Date.now() - startTime;
    await logger.info('Agent execution completed', {
      agentId,
      success: result.success,
      toolCallsCount: result.toolCalls.length,
      durationMs: duration,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = await handleError(error, 'agent_execution', {
      agentId,
      durationMs: duration,
      requestId,
    });

    return {
      success: false,
      message: '',
      toolCalls: [],
      totalExecutionTime: duration,
      error: errorMessage,
    };
  }
}

