/**
 * Tool Registry
 * Centralized registry for all agent tools
 * Following SRP: Only handles tool registration and lookup
 */

import type { Tool, ToolResult } from '@/types/tool.types';
import type { ToolId } from '@/types/agent.types';
import { webSearchTool } from './web-search';

// Tool registry map
const tools = new Map<ToolId, Tool>();

// Register available tools
tools.set('web_search', webSearchTool);

// Tools coming soon (placeholders)
// tools.set('email', emailTool);
// tools.set('calendar', calendarTool);
// tools.set('db_ops', dbOpsTool);

/**
 * Get a tool by ID
 */
export function getTool(toolId: ToolId): Tool | undefined {
  return tools.get(toolId);
}

/**
 * Execute a tool with given parameters
 */
export async function executeTool<TParams = unknown, TResult = unknown>(
  toolId: ToolId,
  params: TParams
): Promise<ToolResult<TResult>> {
  const tool = getTool(toolId);

  if (!tool) {
    console.error(`[Tool Registry] Tool not found: ${toolId}`);
    return {
      success: false,
      error: `Tool "${toolId}" is not available`,
    };
  }

  console.log(`[Tool Registry] Executing tool: ${toolId}`, { params });

  const startTime = Date.now();

  try {
    const result = await tool.execute(params);
    
    console.log(`[Tool Registry] Tool execution completed: ${toolId}`, {
      success: result.success,
      executionTime: result.executionTime || Date.now() - startTime,
    });

    return result as ToolResult<TResult>;
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    console.error(`[Tool Registry] Tool execution failed: ${toolId}`, {
      error,
      executionTime,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Tool execution failed',
      executionTime,
    };
  }
}

/**
 * Get all registered tools
 */
export function getAllTools(): Tool[] {
  return Array.from(tools.values());
}

/**
 * Get tool schemas for OpenAI function calling
 */
export function getToolSchemas(toolIds: ToolId[]): Array<{
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}> {
  return toolIds
    .map((toolId) => {
      const tool = getTool(toolId);
      if (!tool) return null;

      return {
        type: 'function' as const,
        function: {
          name: tool.id,
          description: tool.description,
          parameters: tool.paramsSchema,
        },
      };
    })
    .filter((schema): schema is NonNullable<typeof schema> => schema !== null);
}

/**
 * Check if a tool is available (configured and ready to use)
 */
export function isToolAvailable(toolId: ToolId): boolean {
  const tool = getTool(toolId);
  
  if (!tool) return false;

  // Check tool-specific availability
  switch (toolId) {
    case 'web_search':
      return !!process.env.TAVILY_API_KEY;
    case 'email':
      // Check email service credentials when implemented
      return false;
    case 'calendar':
      // Check calendar service credentials when implemented
      return false;
    case 'db_ops':
      // DB ops don't need external credentials
      return false;
    default:
      return false;
  }
}

