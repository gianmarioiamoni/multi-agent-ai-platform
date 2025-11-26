/**
 * Workflow Engine Utilities
 * Helper types for workflow engine execution
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { WorkflowRunStatus, AgentRunStatus, ToolInvocationStatus } from '@/types/workflow-execution.types';

/**
 * Logging functions type for workflow engine
 */
export interface WorkflowExecutionLoggers {
  createWorkflowRun: (params: {
    workflowId: string;
    input: string;
    userId: string;
  }) => Promise<string>;
  
  updateWorkflowRun: (
    workflowRunId: string,
    updates: {
      status?: WorkflowRunStatus;
      output?: string | null;
      error?: string | null;
      started_at?: string | null;
      finished_at?: string | null;
    }
  ) => Promise<void>;
  
  createAgentRun: (params: {
    workflowRunId: string;
    agentId: string;
    stepOrder: number;
    input: string | null;
  }) => Promise<string>;
  
  updateAgentRun: (
    agentRunId: string,
    updates: {
      status?: AgentRunStatus;
      output?: string | null;
      error?: string | null;
      started_at?: string | null;
      finished_at?: string | null;
    }
  ) => Promise<void>;
  
  createToolInvocation: (params: {
    agentRunId: string;
    tool: string;
    params: Record<string, unknown>;
    status: ToolInvocationStatus;
    result: Record<string, unknown> | null;
    error: string | null;
    started_at: string | null;
    finished_at: string | null;
    execution_time_ms: number;
  }) => Promise<string>;
}

/**
 * Create logging functions using a Supabase client
 */
export function createLoggersFromClient(client: SupabaseClient): WorkflowExecutionLoggers {
  return {
    createWorkflowRun: async (params) => {
      // Workaround: Type inference issue with workflow_runs table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (client as any)
        .from('workflow_runs')
        .insert({
          workflow_id: params.workflowId,
          input: params.input,
          created_by: params.userId,
          status: 'pending',
        })
        .select('id')
        .single() as { data: { id: string } | null; error: { message?: string } | null };

      if (error || !data) {
        throw new Error(`Failed to create workflow run: ${error?.message || 'Unknown error'}`);
      }

      return data.id;
    },

    updateWorkflowRun: async (workflowRunId, updates) => {
      // Workaround: Type inference issue with workflow_runs table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (client as any)
        .from('workflow_runs')
        .update(updates)
        .eq('id', workflowRunId) as { error: { message?: string } | null };

      if (error) {
        throw new Error(`Failed to update workflow run: ${error.message}`);
      }
    },

    createAgentRun: async (params) => {
      // Workaround: Type inference issue with agent_runs table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (client as any)
        .from('agent_runs')
        .insert({
          workflow_run_id: params.workflowRunId,
          agent_id: params.agentId,
          step_order: params.stepOrder,
          input: params.input,
          status: 'pending',
        })
        .select('id')
        .single() as { data: { id: string } | null; error: { message?: string } | null };

      if (error || !data) {
        throw new Error(`Failed to create agent run: ${error?.message || 'Unknown error'}`);
      }

      return data.id;
    },

    updateAgentRun: async (agentRunId, updates) => {
      // Workaround: Type inference issue with agent_runs table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (client as any)
        .from('agent_runs')
        .update(updates)
        .eq('id', agentRunId) as { error: { message?: string } | null };

      if (error) {
        throw new Error(`Failed to update agent run: ${error.message}`);
      }
    },

    createToolInvocation: async (params) => {
      // Workaround: Type inference issue with tool_invocations table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (client as any)
        .from('tool_invocations')
        .insert({
          agent_run_id: params.agentRunId,
          tool: params.tool,
          params: params.params,
          status: params.status,
          result: params.result,
          error: params.error,
          started_at: params.started_at,
          finished_at: params.finished_at,
          execution_time_ms: params.execution_time_ms,
        })
        .select('id')
        .single() as { data: { id: string } | null; error: { message?: string } | null };

      if (error || !data) {
        throw new Error(`Failed to create tool invocation: ${error?.message || 'Unknown error'}`);
      }

      return data.id;
    },
  };
}

