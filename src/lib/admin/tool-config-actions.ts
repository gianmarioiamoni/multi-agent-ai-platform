/**
 * Tool Configuration Server Actions
 * CRUD operations for global tool configurations
 * Only accessible by admin users
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import type { Database } from '@/types/database.types';
import type {
  ToolId,
  ToolConfigRow,
  CreateToolConfigInput,
  UpdateToolConfigInput,
  ToolConfig,
} from '@/types/tool-config.types';

/**
 * Get all tool configurations (admin only)
 */
export async function getToolConfigs(): Promise<{
  data: ToolConfigRow[] | null;
  error: string | null;
}> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== 'admin') {
      return { data: null, error: 'Unauthorized: Admin access required' };
    }

    const supabase = await createClient();

    // Workaround: Type inference issue - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('tool_configs')
      .select('*')
      .order('tool_id', { ascending: true }) as {
      data: ToolConfigRow[] | null;
      error: unknown;
    };

    if (error) {
      console.error('Error fetching tool configs:', error);
      return { data: null, error: 'Failed to fetch tool configurations' };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getToolConfigs:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Get a specific tool configuration (admin only)
 */
export async function getToolConfig(toolId: ToolId): Promise<{
  data: ToolConfigRow | null;
  error: string | null;
}> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== 'admin') {
      return { data: null, error: 'Unauthorized: Admin access required' };
    }

    const supabase = await createClient();

    // Workaround: Type inference issue - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('tool_configs')
      .select('*')
      .eq('tool_id', toolId)
      .single() as {
      data: ToolConfigRow | null;
      error: unknown;
    };

    if (error) {
      // Not found is OK (tool not configured yet)
      if ((error as { code?: string })?.code === 'PGRST116') {
        return { data: null, error: null };
      }
      console.error('Error fetching tool config:', error);
      return { data: null, error: 'Failed to fetch tool configuration' };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getToolConfig:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Create or update a tool configuration (admin only)
 */
export async function upsertToolConfig(
  input: CreateToolConfigInput
): Promise<{
  data: ToolConfigRow | null;
  error: string | null;
}> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== 'admin') {
      return { data: null, error: 'Unauthorized: Admin access required' };
    }

    const supabase = await createClient();

    const configData: Database['public']['Tables']['tool_configs']['Insert'] = {
      tool_id: input.tool_id,
      config: input.config as Database['public']['Tables']['tool_configs']['Insert']['config'],
      enabled: input.enabled ?? true,
      updated_by: profile.userId,
    };

    // Workaround: Type inference issue - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('tool_configs')
      .upsert(configData, {
        onConflict: 'tool_id',
      })
      .select()
      .single() as {
      data: ToolConfigRow | null;
      error: unknown;
    };

    if (error) {
      console.error('Error upserting tool config:', error);
      return { data: null, error: 'Failed to save tool configuration' };
    }

    revalidatePath('/admin/settings');
    return { data, error: null };
  } catch (error) {
    console.error('Error in upsertToolConfig:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Update a tool configuration (admin only)
 */
export async function updateToolConfig(
  toolId: ToolId,
  input: UpdateToolConfigInput
): Promise<{
  data: ToolConfigRow | null;
  error: string | null;
}> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== 'admin') {
      return { data: null, error: 'Unauthorized: Admin access required' };
    }

    const supabase = await createClient();

    // Get existing config to merge
    const { data: existing } = await getToolConfig(toolId);
    if (!existing) {
      return { data: null, error: 'Tool configuration not found' };
    }

    const existingConfig = existing.config as ToolConfig;

    // Merge configs
    const updatedConfig: ToolConfig = {
      ...existingConfig,
      ...(input.config || {}),
    };

    const updateData: Database['public']['Tables']['tool_configs']['Update'] = {
      config: updatedConfig as Database['public']['Tables']['tool_configs']['Update']['config'],
      enabled: input.enabled !== undefined ? input.enabled : existing.enabled,
      updated_by: profile.userId,
    };

    // Workaround: Type inference issue - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('tool_configs')
      .update(updateData)
      .eq('tool_id', toolId)
      .select()
      .single() as {
      data: ToolConfigRow | null;
      error: unknown;
    };

    if (error) {
      console.error('Error updating tool config:', error);
      return { data: null, error: 'Failed to update tool configuration' };
    }

    revalidatePath('/admin/settings');
    return { data, error: null };
  } catch (error) {
    console.error('Error in updateToolConfig:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a tool configuration (admin only)
 */
export async function deleteToolConfig(toolId: ToolId): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const profile = await getCurrentUserProfile();

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    const supabase = await createClient();

    // Workaround: Type inference issue - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('tool_configs')
      .delete()
      .eq('tool_id', toolId) as { error: unknown };

    if (error) {
      console.error('Error deleting tool config:', error);
      return { success: false, error: 'Failed to delete tool configuration' };
    }

    revalidatePath('/admin/settings');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in deleteToolConfig:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

