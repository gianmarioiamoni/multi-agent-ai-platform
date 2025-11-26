/**
 * Workflow Server Actions
 * CRUD operations and execution for workflows
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import { executeWorkflow } from './engine';
import { checkRateLimit } from '@/lib/rate-limiting/rate-limiter';
import { handleError, createUserFriendlyError } from '@/lib/errors/error-handler';
import { logInfo, logWarn } from '@/lib/logging/logger';
import type { Database, Json } from '@/types/database.types';
import type {
  Workflow,
  CreateWorkflowInput,
  UpdateWorkflowInput,
  WorkflowListItem,
  WorkflowGraph,
} from '@/types/workflow.types';
import type {
  WorkflowExecutionResult,
  WorkflowRun,
  AgentRun,
  ToolInvocation,
} from '@/types/workflow-execution.types';

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

    // Prepare workflow data - match database Insert type exactly
    const workflowData: Database['public']['Tables']['workflows']['Insert'] = {
      owner_id: user.id,
      name: input.name,
      description: input.description || null,
      graph: (input.graph || defaultGraph) as unknown as Json,
      status: 'draft',
    };

    // Workaround: Supabase client type inference issue - TypeScript sees 'never' for workflows table
    // even though types are correctly defined in Database. Cast to any is necessary here.
    // The data is correctly typed above (workflowData: Database['public']['Tables']['workflows']['Insert'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
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

    const existingData = existing as { owner_id?: string } | null;
    if (!existingData || existingData.owner_id !== user.id) {
      return { data: null, error: 'Workflow not found' };
    }

    // Update workflow - convert UpdateWorkflowInput to database Update type
    const updateData: Database['public']['Tables']['workflows']['Update'] = {
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.graph && { graph: input.graph as unknown as Json }),
      ...(input.status && { status: input.status }),
    };

    // Workaround: Supabase client type inference issue - TypeScript sees 'never' for workflows table
    // even though types are correctly defined in Database. Cast to any is necessary here.
    // The data is correctly typed above (updateData: Database['public']['Tables']['workflows']['Update'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('workflows')
      .update(updateData)
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

    const existingData = existing as { owner_id?: string } | null;
    if (!existingData || existingData.owner_id !== user.id) {
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
      const errorDetails = createUserFriendlyError(
        new Error('Unauthorized'),
        'authentication',
        { workflowId }
      );
      await logWarn('workflow.engine', 'Unauthorized workflow execution attempt', { workflowId });
      return { data: null, error: errorDetails.userMessage };
    }

    await logInfo('workflow.engine', 'Starting workflow run', { workflowId, userId: user.id, inputLength: input.length });

    // Get workflow
    const workflowResult = await getWorkflow(workflowId);
    if (workflowResult.error || !workflowResult.data) {
      const errorDetails = createUserFriendlyError(
        new Error(workflowResult.error || 'Workflow not found'),
        'not_found',
        { workflowId, userId: user.id }
      );
      await logWarn('workflow.engine', 'Workflow not found for execution', { workflowId, userId: user.id });
      return { data: null, error: errorDetails.userMessage };
    }

    const workflow = workflowResult.data;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(user.id, 'workflow:run');

    if (!rateLimitResult.allowed) {
      const resetInMinutes = Math.ceil(
        (rateLimitResult.resetAt.getTime() - Date.now()) / 1000 / 60
      );
      const errorDetails = createUserFriendlyError(
        new Error(`Rate limit exceeded. Please try again in ${resetInMinutes} minute(s).`),
        'rate_limit',
        { userId: user.id, workflowId }
      );
      await logWarn('rate_limit', 'Workflow execution rate limit exceeded', {
        userId: user.id,
        workflowId,
        remaining: rateLimitResult.remaining,
      });
      return { data: null, error: errorDetails.userMessage };
    }

    // Execute workflow
    const result = await executeWorkflow(workflow, input, user.id);

    // Update workflow last_run_at
    const supabase = await createClient();
    // Workaround: Type inference issue with workflows table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('workflows')
      .update({ last_run_at: new Date().toISOString() })
      .eq('id', workflowId);

    revalidatePath('/app/workflows');
    revalidatePath(`/app/workflows/${workflowId}`);

    await logInfo('workflow.engine', 'Workflow run completed', {
      workflowId,
      workflowRunId: result.workflowRunId,
      success: result.success,
      durationMs: result.totalExecutionTime,
    });

    return { data: result, error: null };
  } catch (error) {
    const errorMessage = await handleError(error, 'workflow_execution', { workflowId });
    return {
      data: null,
      error: errorMessage,
    };
  }
}

/**
 * Get all workflow runs for the current user
 */
export async function getWorkflowRuns(): Promise<{
  data: Array<WorkflowRun & { workflow_name: string }> | null;
  error: string | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Workaround: Type inference issue with workflow_runs table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('workflow_runs')
      .select(
        `
        *,
        workflows!inner(name)
      `
      )
      .order('created_at', { ascending: false })
      .limit(50) as { data: Array<{ workflows: { name: string } }> | null; error: unknown };

    if (error) {
      console.error('Error fetching workflow runs:', error);
      return { data: null, error: 'Failed to fetch workflow runs' };
    }

    const runs = (data || []).map((run) => {
      const workflow = run.workflows as { name: string } | { name: string }[] | null;
      const workflowName = Array.isArray(workflow) 
        ? workflow[0]?.name 
        : workflow?.name 
        || 'Unknown';
      
      // Remove workflows from the run object
      const { workflows, ...runData } = run;
      
      return {
        ...runData,
        workflow_name: workflowName,
      } as WorkflowRun & { workflow_name: string };
    });

    return { data: runs, error: null };
  } catch (error) {
    console.error('Error in getWorkflowRuns:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Get a single workflow run with all details
 */
export async function getWorkflowRun(runId: string): Promise<{
  data: (WorkflowRun & {
    workflow_name: string;
    agent_runs: Array<AgentRun & { agent_name: string; tool_invocations: ToolInvocation[] }>;
  }) | null;
  error: string | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Get workflow run with workflow name
    // Workaround: Type inference issue with workflow_runs table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: runData, error: runError } = await (supabase as any)
      .from('workflow_runs')
      .select(
        `
        *,
        workflows!inner(name)
      `
      )
      .eq('id', runId)
      .single() as { data: { workflows: { name: string } | { name: string }[] | null } | null; error: unknown };

    if (runError || !runData) {
      console.error('Error fetching workflow run:', runError);
      return { data: null, error: 'Workflow run not found' };
    }

    // Extract workflow name and remove workflows from runData
    const workflow = runData.workflows as { name: string } | { name: string }[] | null;
    const workflowName = Array.isArray(workflow) 
      ? workflow[0]?.name 
      : workflow?.name 
      || 'Unknown';
    const { workflows, ...runDataClean } = runData;

    // Get agent runs with agent names
    // Workaround: Type inference issue with agent_runs table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: agentRunsData, error: agentRunsError } = await (supabase as any)
      .from('agent_runs')
      .select(
        `
        *,
        agents!inner(name)
      `
      )
      .eq('workflow_run_id', runId)
      .order('step_order', { ascending: true }) as { data: Array<{ id: string; agents?: { name: string } }> | null; error: unknown };

    if (agentRunsError) {
      console.error('Error fetching agent runs:', agentRunsError);
      return { data: null, error: 'Failed to fetch agent runs' };
    }

    // Get tool invocations for each agent run
    const agentRunIds = (agentRunsData || []).map((ar) => ar.id);
    // Workaround: Type inference issue with tool_invocations table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: toolInvocationsData, error: toolInvocationsError } = agentRunIds.length > 0
      ? await (supabase as any)
          .from('tool_invocations')
          .select('*')
          .in('agent_run_id', agentRunIds)
          .order('created_at', { ascending: true }) as { data: Array<{ agent_run_id: string }> | null; error: unknown }
      : { data: [], error: null };

    if (toolInvocationsError) {
      console.error('Error fetching tool invocations:', toolInvocationsError);
      return { data: null, error: 'Failed to fetch tool invocations' };
    }

    // Combine data
    const agentRuns = (agentRunsData || []).map((ar) => {
      const agent = ar.agents as { name: string } | { name: string }[] | null;
      const agentName = Array.isArray(agent) 
        ? agent[0]?.name 
        : agent?.name 
        || 'Unknown';
      
      const { agents, ...arClean } = ar;
      
      return {
        ...arClean,
        agent_name: agentName,
        tool_invocations: (toolInvocationsData || []).filter(
          (ti) => ti.agent_run_id === ar.id
        ) as ToolInvocation[],
      } as AgentRun & { agent_name: string; tool_invocations: ToolInvocation[] };
    });

    const workflowRun = {
      ...runDataClean,
      workflow_name: workflowName,
      agent_runs: agentRuns,
    } as WorkflowRun & {
      workflow_name: string;
      agent_runs: Array<AgentRun & { agent_name: string; tool_invocations: ToolInvocation[] }>;
    };

    return { data: workflowRun, error: null };
  } catch (error) {
    console.error('Error in getWorkflowRun:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

