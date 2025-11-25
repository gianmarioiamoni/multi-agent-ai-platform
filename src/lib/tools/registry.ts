/**
 * Tool Registry
 * Centralized registry for all agent tools
 * Following SRP: Only handles tool registration and lookup
 */

import type { Tool, ToolResult } from '@/types/tool.types';
import type { ToolId } from '@/types/agent.types';
import { webSearchTool } from './web-search';
import { emailTool } from './email';
import { calendarTool } from './calendar';
import { dbOpsTool } from './db-ops';

// Tool registry map
const tools = new Map<ToolId, Tool>();

// Register available tools
tools.set('web_search', webSearchTool);
tools.set('email', emailTool);
tools.set('calendar', calendarTool);
tools.set('db_ops', dbOpsTool);

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
    return {
      success: false,
      error: `Tool "${toolId}" is not available`,
    };
  }

  const startTime = Date.now();

  try {
    const result = await tool.execute(params);
    return result as ToolResult<TResult>;
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
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
      // Check SMTP configuration
      return !!(
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASSWORD
      );
    case 'calendar':
      // Calendar tool requires user to connect their Google account
      // Availability is checked per-user in the tool itself
      return !!(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET
      );
    case 'db_ops':
      // DB ops don't need external credentials
      return true; // Always available
    default:
      return false;
  }
}

