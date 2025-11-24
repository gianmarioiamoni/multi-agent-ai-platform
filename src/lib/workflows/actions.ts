/**
 * Workflow Server Actions
 * CRUD operations and execution for workflows
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import { executeWorkflow } from './engine';
import type {
  Workflow,
  CreateWorkflowInput,
  UpdateWorkflowInput,
  WorkflowListItem,
  WorkflowGraph,
} from '@/types/workflow.types';
import type { WorkflowExecutionResult } from '@/types/workflow-execution.types';

/**
 * Get all workflows for the current user
 */
export async function getWorkflows(): Promise<{
  data: WorkflowListItem[] | null;
  error: string | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workflows')
      .select('id, name, description, status, created_at, last_run_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workflows:', error);
      return { data: null, error: 'Failed to fetch workflows' };
    }

    return { data: data as WorkflowListItem[], error: null };
  } catch (error) {
    console.error('Error in getWorkflows:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Get a single workflow by ID
 */
export async function getWorkflow(
  workflowId: string
): Promise<{ data: Workflow | null; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .eq('owner_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching workflow:', error);
      return { data: null, error: 'Workflow not found' };
    }

    return { data: data as Workflow, error: null };
  } catch (error) {
    console.error('Error in getWorkflow:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new workflow
 */
export async function createWorkflow(
  input: CreateWorkflowInput
): Promise<{ data: Workflow | null; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Default graph structure
    const defaultGraph: WorkflowGraph = {
      steps: [],
      edges: [],
      triggers: {
        manual: true,
      },
    };

    const workflowData = {
      owner_id: user.id,
      name: input.name,
      description: input.description || null,
      graph: input.graph || defaultGraph,
      status: 'draft' as const,
    };

    const { data, error } = await supabase
      .from('workflows')
      .insert(workflowData)
      .select()
      .single();

    if (error) {
      console.error('Error creating workflow:', error);
      return { data: null, error: 'Failed to create workflow' };
    }

    revalidatePath('/app/workflows');

    return { data: data as Workflow, error: null };
  } catch (error) {
    console.error('Error in createWorkflow:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Update an existing workflow
 */
export async function updateWorkflow(
  workflowId: string,
  input: UpdateWorkflowInput
): Promise<{ data: Workflow | null; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('workflows')
      .select('owner_id')
      .eq('id', workflowId)
      .single();

    if (!existing || existing.owner_id !== user.id) {
      return { data: null, error: 'Workflow not found' };
    }

    // Update workflow
    const { data, error } = await supabase
      .from('workflows')
      .update(input)
      .eq('id', workflowId)
      .select()
      .single();

    if (error) {
      console.error('Error updating workflow:', error);
      return { data: null, error: 'Failed to update workflow' };
    }

    revalidatePath('/app/workflows');
    revalidatePath(`/app/workflows/${workflowId}`);

    return { data: data as Workflow, error: null };
  } catch (error) {
    console.error('Error in updateWorkflow:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(
  workflowId: string
): Promise<{ error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('workflows')
      .select('owner_id')
      .eq('id', workflowId)
      .single();

    if (!existing || existing.owner_id !== user.id) {
      return { error: 'Workflow not found' };
    }

    // Delete workflow
    const { error } = await supabase.from('workflows').delete().eq('id', workflowId);

    if (error) {
      console.error('Error deleting workflow:', error);
      return { error: 'Failed to delete workflow' };
    }

    revalidatePath('/app/workflows');

    return { error: null };
  } catch (error) {
    console.error('Error in deleteWorkflow:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Execute a workflow
 */
export async function runWorkflow(
  workflowId: string,
  input: string
): Promise<{ data: WorkflowExecutionResult | null; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    // Get workflow
    const workflowResult = await getWorkflow(workflowId);
    if (workflowResult.error || !workflowResult.data) {
      return { data: null, error: workflowResult.error || 'Workflow not found' };
    }

    const workflow = workflowResult.data;

    // Execute workflow
    const result = await executeWorkflow(workflow, input, user.id);

    // Update workflow last_run_at
    const supabase = await createClient();
    await supabase
      .from('workflows')
      .update({ last_run_at: new Date().toISOString() })
      .eq('id', workflowId);

    revalidatePath('/app/workflows');
    revalidatePath(`/app/workflows/${workflowId}`);

    return { data: result, error: null };
  } catch (error) {
    console.error('Error in runWorkflow:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

