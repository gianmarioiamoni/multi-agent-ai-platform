/**
 * DB Operations Tool
 * Implements safe database operations via internal API endpoints
 * Following SRP: Only handles DB operations tool logic
 */

import type { Tool, ToolResult } from '@/types/tool.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const DB_OPS_TIMEOUT = 10000; // 10 seconds

/**
 * DB Operations Tool implementation
 * Calls internal API endpoints for safe database operations
 */
export const dbOpsTool: Tool = {
  id: 'db_ops',
  name: 'Database Operations',
  description:
    'Perform safe database operations like getting open tasks or inserting reports. Uses internal API endpoints for security.',
  
  paramsSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['get_open_tasks', 'insert_report'],
        description: 'The database operation to perform',
      },
      // For insert_report
      reportData: {
        type: 'object',
        description: 'Report data to insert',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          type: { type: 'string' },
          metadata: { type: 'object' },
        },
      },
    },
    required: ['operation'],
  },

  async execute(params: unknown): Promise<ToolResult<unknown>> {
    const startTime = Date.now();

    try {
      const dbParams = params as {
        operation: 'get_open_tasks' | 'insert_report';
        reportData?: {
          title: string;
          content: string;
          type?: string;
          metadata?: Record<string, unknown>;
        };
      };

      if (!dbParams.operation) {
        return {
          success: false,
          error: 'Operation is required',
          executionTime: Date.now() - startTime,
        };
      }

      // Route to appropriate API endpoint
      let endpoint: string;
      let method: 'GET' | 'POST';
      let body: unknown = undefined;

      if (dbParams.operation === 'get_open_tasks') {
        endpoint = '/api/tools/db/get-open-tasks';
        method = 'GET';
      } else if (dbParams.operation === 'insert_report') {
        endpoint = '/api/tools/db/insert-report';
        method = 'POST';
        
        if (!dbParams.reportData) {
          return {
            success: false,
            error: 'reportData is required for insert_report operation',
            executionTime: Date.now() - startTime,
          };
        }

        body = dbParams.reportData;
      } else {
        return {
          success: false,
          error: `Unknown operation: ${dbParams.operation}`,
          executionTime: Date.now() - startTime,
        };
      }

      // Call internal API endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DB_OPS_TIMEOUT);

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: response.statusText }));
          console.error('[DB Ops Tool] API error:', errorData);
          return {
            success: false,
            error: `Database operation failed: ${errorData.error || response.statusText}`,
            executionTime: Date.now() - startTime,
          };
        }

        const data = await response.json();

        return {
          success: true,
          data,
          executionTime: Date.now() - startTime,
        };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Database operation timeout',
          executionTime: Date.now() - startTime,
        };
      }

      console.error('[DB Ops Tool] Execution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database operation failed',
        executionTime: Date.now() - startTime,
      };
    }
  },
};

