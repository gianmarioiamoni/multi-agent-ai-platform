/**
 * Workflow Execution Log
 * Functions for logging workflow executions to database
 * Following SRP: Only handles database logging operations
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import type { WorkflowRunStatus, AgentRunStatus, ToolInvocationStatus } from '@/types/workflow-execution.types';

/**
 * Create a workflow run
 */
export async function createWorkflowRun(params: {
  workflowId: string;
  input: string;
  userId: string;
}): Promise<string> {
  const supabase = await createClient();

  // Workaround: Type inference issue with workflow_runs table - cast needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
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
    console.error('[Execution Log] Error creating workflow run:', error);
    throw new Error(`Failed to create workflow run: ${error?.message || 'Unknown error'}`);
  }

  // Type assertion: data is guaranteed to be non-null after the check above
  if (!data.id) {
    throw new Error('Failed to create workflow run: No ID returned');
  }

  return data.id;
}

/**
 * Update a workflow run
 */
export async function updateWorkflowRun(
  workflowRunId: string,
  updates: {
    status?: WorkflowRunStatus;
    output?: string | null;
    error?: string | null;
    started_at?: string | null;
    finished_at?: string | null;
  }
): Promise<void> {
  const supabase = await createClient();

  // Workaround: Type inference issue with workflow_runs table - cast needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('workflow_runs')
    .update(updates)
    .eq('id', workflowRunId) as { error: { message?: string } | null };

  if (error) {
    console.error('[Execution Log] Error updating workflow run:', error);
    throw new Error(`Failed to update workflow run: ${error.message}`);
  }
}

/**
 * Create an agent run
 */
export async function createAgentRun(params: {
  workflowRunId: string;
  agentId: string;
  stepOrder: number;
  input: string | null;
}): Promise<string> {
  const supabase = await createClient();

  // Workaround: Type inference issue with agent_runs table - cast needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
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
    console.error('[Execution Log] Error creating agent run:', error);
    throw new Error(`Failed to create agent run: ${error?.message || 'Unknown error'}`);
  }

  // Type assertion: data is guaranteed to be non-null after the check above
  if (!data.id) {
    throw new Error('Failed to create agent run: No ID returned');
  }

  return data.id;
}

/**
 * Update an agent run
 */
export async function updateAgentRun(
  agentRunId: string,
  updates: {
    status?: AgentRunStatus;
    output?: string | null;
    error?: string | null;
    started_at?: string | null;
    finished_at?: string | null;
  }
): Promise<void> {
  const supabase = await createClient();

  // Workaround: Type inference issue with agent_runs table - cast needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('agent_runs')
    .update(updates)
    .eq('id', agentRunId) as { error: { message?: string } | null };

  if (error) {
    console.error('[Execution Log] Error updating agent run:', error);
    throw new Error(`Failed to update agent run: ${error.message}`);
  }
}

/**
 * Create a tool invocation
 */
export async function createToolInvocation(params: {
  agentRunId: string;
  tool: string;
  params: Record<string, unknown>;
  status: ToolInvocationStatus;
  result: Record<string, unknown> | null;
  error: string | null;
  started_at: string | null;
  finished_at: string | null;
  execution_time_ms: number;
}): Promise<string> {
  const supabase = await createClient();

  // Workaround: Type inference issue with tool_invocations table - cast needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
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
    console.error('[Execution Log] Error creating tool invocation:', error);
    throw new Error(`Failed to create tool invocation: ${error?.message || 'Unknown error'}`);
  }

  // Type assertion: data is guaranteed to be non-null after the check above
  if (!data.id) {
    throw new Error('Failed to create tool invocation: No ID returned');
  }

  return data.id;
}

