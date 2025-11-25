/**
 * Agent Orchestrator
 * Orchestrates agent execution with OpenAI function calling
 * Following SRP: Only handles agent orchestration logic
 */

import { getOpenAIClient, isOpenAIConfigured } from './openai-client';
import { getToolSchemas, executeTool } from '@/lib/tools/registry';
import type { AgentExecutionResult, ToolCall, ToolExecution } from '@/types/orchestrator.types';
import type { Agent } from '@/types/agent.types';
import type { ToolId } from '@/types/agent.types';

const MAX_ITERATIONS = 10; // Max tool call iterations to prevent infinite loops

/**
 * Map OpenAI model name to OpenAI API model identifier
 */
function mapModelToOpenAI(agentModel: Agent['model']): string {
  const modelMap: Record<string, string> = {
    'gpt-4o': 'gpt-4o',
    'gpt-4o-mini': 'gpt-4o-mini',
    'gpt-4-turbo': 'gpt-4-turbo',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
  };
  return modelMap[agentModel] || 'gpt-4o-mini';
}

/**
 * Execute a single tool call
 */
async function executeToolCall(
  toolCall: {
    id: string;
    function: {
      name: string;
      arguments: string;
    };
  }
): Promise<ToolExecution> {
  const startTime = Date.now();
  
  try {
    // Parse tool name and params
    const toolId = toolCall.function.name as ToolId;
    let params: Record<string, unknown>;
    
    try {
      params = JSON.parse(toolCall.function.arguments);
    } catch (error) {
      throw new Error(`Invalid tool arguments: ${toolCall.function.arguments}`);
    }

    const call: ToolCall = {
      id: toolCall.id,
      toolId,
      params,
    };

    // Execute tool
    const result = await executeTool(toolId, params);
    const executionTime = Date.now() - startTime;

    return {
      call,
      result,
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    return {
      call: {
        id: toolCall.id,
        toolId: toolCall.function.name as ToolId,
        params: {},
      },
      result: {
        success: false,
        error: error instanceof Error ? error.message : 'Tool execution failed',
        executionTime,
      },
      executionTime,
    };
  }
}

/**
 * Orchestrate agent execution with OpenAI function calling
 */
export async function orchestrateAgent(
  agent: Agent,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AgentExecutionResult> {
  const startTime = Date.now();

  try {
    // Validate OpenAI configuration
    if (!isOpenAIConfigured()) {
      return {
        success: false,
        message: '',
        toolCalls: [],
        totalExecutionTime: Date.now() - startTime,
        error: 'OpenAI is not configured. Please set OPENAI_API_KEY.',
      };
    }

    // Get OpenAI client
    const client = getOpenAIClient();

    // Get tool schemas for enabled tools (can be empty for text-only agents)
    const toolSchemas = agent.tools_enabled && agent.tools_enabled.length > 0
      ? getToolSchemas(agent.tools_enabled)
      : [];

    // Build messages array
    const messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
      tool_calls?: Array<{
        id: string;
        type: 'function';
        function: {
          name: string;
          arguments: string;
        };
      }>;
      tool_call_id?: string;
    }> = [
      {
        role: 'system',
        content: agent.role || 'You are a helpful AI assistant.',
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const toolCalls: ToolExecution[] = [];
    let iteration = 0;
    let finalMessage = '';

    // Main loop: handle function calling iterations
    while (iteration < MAX_ITERATIONS) {
      iteration++;

      // Call OpenAI API
      const response = await client.chat.completions.create({
        model: mapModelToOpenAI(agent.model),
        messages,
        temperature: agent.temperature || 0.7,
        max_tokens: agent.max_tokens || 2000,
        tools: toolSchemas.length > 0 ? toolSchemas : undefined,
        tool_choice: toolSchemas.length > 0 ? 'auto' : undefined,
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No response from OpenAI');
      }

      const message = choice.message;

      // Add assistant response to messages
      messages.push(message);

      // Check if tool calls are requested
      if (message.tool_calls && message.tool_calls.length > 0) {
        // Execute all tool calls in parallel
        const toolExecutionPromises = message.tool_calls.map((toolCall) =>
          executeToolCall(toolCall)
        );
        const executions = await Promise.all(toolExecutionPromises);

        // Add tool results to messages and collect executions
        for (const execution of executions) {
          toolCalls.push(execution);

          // Add tool response to messages for next iteration
          messages.push({
            role: 'tool',
            content: execution.result.success
              ? JSON.stringify(execution.result.data)
              : JSON.stringify({ error: execution.result.error }),
            tool_call_id: execution.call.id,
          });
        }

        // Continue loop to get final response
        continue;
      }

      // No more tool calls, final response
      if (message.content) {
        finalMessage = message.content;
        break;
      }
    }

    const totalExecutionTime = Date.now() - startTime;

    if (iteration >= MAX_ITERATIONS) {
      return {
        success: false,
        message: finalMessage || 'Agent execution exceeded maximum iterations.',
        toolCalls,
        totalExecutionTime,
        error: 'Maximum iterations reached. The agent may be in an infinite loop.',
      };
    }

    console.log('[Orchestrator] Agent execution completed:', {
      success: true,
      messageLength: finalMessage.length,
      toolCallsCount: toolCalls.length,
      totalExecutionTime,
    });

    return {
      success: true,
      message: finalMessage,
      toolCalls,
      totalExecutionTime,
    };
  } catch (error) {
    const totalExecutionTime = Date.now() - startTime;
    
    return {
      success: false,
      message: '',
      toolCalls: [],
      totalExecutionTime,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

