/**
 * Workflow Types
 * Type definitions for multi-agent workflows
 */

// Workflow status
export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived';

// Workflow step
export interface WorkflowStep {
  id: string;
  agentId: string;
  name: string;
  config?: Record<string, unknown>;
}

// Workflow edge (connection between steps)
export interface WorkflowEdge {
  id: string;
  from: string; // step id
  to: string; // step id
  condition?: string; // Optional condition for conditional execution
}

// Workflow triggers
export interface WorkflowTriggers {
  manual?: boolean;
  schedule?: string; // Cron expression
  webhook?: boolean;
  [key: string]: unknown; // Extensible
}

// Workflow graph structure
export interface WorkflowGraph {
  steps: WorkflowStep[];
  edges: WorkflowEdge[];
  triggers: WorkflowTriggers;
}

// Workflow from database
export interface Workflow {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  graph: WorkflowGraph;
  status: WorkflowStatus;
  created_at: string;
  updated_at: string;
  last_run_at: string | null;
}

// Workflow creation payload
export interface CreateWorkflowInput {
  name: string;
  description?: string;
  graph?: WorkflowGraph;
}

// Workflow update payload
export interface UpdateWorkflowInput {
  name?: string;
  description?: string | null;
  graph?: WorkflowGraph;
  status?: WorkflowStatus;
}

// Workflow list item (for list views)
export interface WorkflowListItem {
  id: string;
  name: string;
  description: string | null;
  status: WorkflowStatus;
  created_at: string;
  last_run_at: string | null;
}

