/**
 * Agent Server Actions
 * CRUD operations for AI agents
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import type { Database } from '@/types/database.types';
import type {
  Agent,
  CreateAgentInput,
  UpdateAgentInput,
  AgentListItem,
} from '@/types/agent.types';

/**
 * Get all agents for the current user
 */
export async function getAgents(): Promise<{
  data: AgentListItem[] | null;
  error: string | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('agents')
      .select('id, name, description, model, tools_enabled, status, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agents:', error);
      return { data: null, error: 'Failed to fetch agents' };
    }

    return { data: data as AgentListItem[], error: null };
  } catch (error) {
    console.error('Error in getAgents:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Get a single agent by ID
 */
export async function getAgent(
  agentId: string
): Promise<{ data: Agent | null; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('owner_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching agent:', error);
      return { data: null, error: 'Agent not found' };
    }

    return { data: data as Agent, error: null };
  } catch (error) {
    console.error('Error in getAgent:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new agent
 */
export async function createAgent(
  input: CreateAgentInput
): Promise<{ data: Agent | null; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Prepare agent data - match database Insert type exactly
    const agentData: Database['public']['Tables']['agents']['Insert'] = {
      owner_id: user.id,
      name: input.name,
      description: input.description || null,
      role: input.role,
      model: input.model,
      temperature: input.temperature ?? 0.7,
      max_tokens: input.max_tokens ?? 2000,
      tools_enabled: (input.tools_enabled ?? []) as string[],
      config: (input.config ?? {}) as Database['public']['Tables']['agents']['Insert']['config'],
      status: 'active',
    };

    // Workaround: Supabase client type inference issue - TypeScript sees 'never' for agents table
    // even though types are correctly defined in Database. Cast to any is necessary here.
    // The data is correctly typed above (agentData: Database['public']['Tables']['agents']['Insert'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('agents')
      .insert(agentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating agent:', error);
      return { data: null, error: 'Failed to create agent' };
    }

    // Revalidate agents page
    revalidatePath('/app/agents');

    return { data: data as Agent, error: null };
  } catch (error) {
    console.error('Error in createAgent:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Update an existing agent
 */
export async function updateAgent(
  agentId: string,
  input: UpdateAgentInput
): Promise<{ data: Agent | null; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('agents')
      .select('owner_id')
      .eq('id', agentId)
      .single();

    const existingData = existing as { owner_id?: string } | null;
    if (!existingData || existingData.owner_id !== user.id) {
      return { data: null, error: 'Agent not found or unauthorized' };
    }

    // Update agent - convert UpdateAgentInput to database Update type
    const updateData: Database['public']['Tables']['agents']['Update'] = {
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.role && { role: input.role }),
      ...(input.model && { model: input.model }),
      ...(input.temperature !== undefined && { temperature: input.temperature }),
      ...(input.max_tokens !== undefined && { max_tokens: input.max_tokens }),
      ...(input.tools_enabled !== undefined && { tools_enabled: input.tools_enabled as string[] }),
      ...(input.config !== undefined && { config: input.config as Database['public']['Tables']['agents']['Update']['config'] }),
      ...(input.status && { status: input.status }),
    };

    // Workaround: Supabase client type inference issue - TypeScript sees 'never' for agents table
    // even though types are correctly defined in Database. Cast to any is necessary here.
    // The data is correctly typed above (updateData: Database['public']['Tables']['agents']['Update'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('agents')
      .update(updateData)
      .eq('id', agentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent:', error);
      return { data: null, error: 'Failed to update agent' };
    }

    // Revalidate
    revalidatePath('/app/agents');
    revalidatePath(`/app/agents/${agentId}`);

    return { data: data as Agent, error: null };
  } catch (error) {
    console.error('Error in updateAgent:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete an agent
 */
export async function deleteAgent(
  agentId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from('agents')
      .select('owner_id')
      .eq('id', agentId)
      .single();

    const existingData = existing as { owner_id?: string } | null;
    if (!existingData || existingData.owner_id !== user.id) {
      return { success: false, error: 'Agent not found or unauthorized' };
    }

    // Delete agent
    const { error } = await supabase.from('agents').delete().eq('id', agentId);

    if (error) {
      console.error('Error deleting agent:', error);
      return { success: false, error: 'Failed to delete agent' };
    }

    // Revalidate
    revalidatePath('/app/agents');

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in deleteAgent:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Archive an agent (soft delete)
 */
export async function archiveAgent(
  agentId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const result = await updateAgent(agentId, { status: 'archived' });
    
    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in archiveAgent:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

