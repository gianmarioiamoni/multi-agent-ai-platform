/**
 * Workflow Execution Types
 * Type definitions for workflow execution tracking
 */

// Workflow run status
export type WorkflowRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

// Agent run status
export type AgentRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

// Tool invocation status
export type ToolInvocationStatus = 'pending' | 'running' | 'completed' | 'failed';

// Workflow run from database
export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: WorkflowRunStatus;
  input: string | null;
  output: string | null;
  error: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Agent run from database
export interface AgentRun {
  id: string;
  workflow_run_id: string;
  agent_id: string;
  status: AgentRunStatus;
  step_order: number;
  input: string | null;
  output: string | null;
  error: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

// Tool invocation from database
export interface ToolInvocation {
  id: string;
  agent_run_id: string;
  tool: string;
  params: Record<string, unknown>;
  status: ToolInvocationStatus;
  result: Record<string, unknown> | null;
  error: string | null;
  started_at: string | null;
  finished_at: string | null;
  execution_time_ms: number | null;
  created_at: string;
  updated_at: string;
}

// Workflow execution input
export interface WorkflowExecutionInput {
  workflowId: string;
  input: string;
  userId: string;
}

// Workflow execution result
export interface WorkflowExecutionResult {
  success: boolean;
  workflowRunId: string;
  output?: string;
  error?: string;
  agentRuns: Array<{
    id: string;
    agentId: string;
    stepOrder: number;
    status: AgentRunStatus;
    output?: string;
    error?: string;
  }>;
  totalExecutionTime: number;
}

