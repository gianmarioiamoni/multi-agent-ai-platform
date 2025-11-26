/**
 * Search Server Actions
 * Search functionality for agents and workflows
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';

export interface SearchResult {
  id: string;
  type: 'agent' | 'workflow';
  name: string;
  description: string | null;
  href: string;
}

/**
 * Search agents and workflows by name or description
 */
export async function searchAll(query: string): Promise<{
  data: SearchResult[] | null;
  error: string | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    if (!query || query.trim().length < 2) {
      return { data: [], error: null };
    }

    const supabase = await createClient();
    const searchTerm = query.trim();
    const searchPattern = `%${searchTerm}%`;

    const results: SearchResult[] = [];

    // Search agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id, name, description')
      .eq('owner_id', user.id)
      .or(`name.ilike."${searchPattern}",description.ilike."${searchPattern}"`)
      .limit(5);

    if (agentsError) {
      console.error('Error searching agents:', agentsError);
    } else if (agents) {
      results.push(
        ...agents.map((agent) => ({
          id: agent.id,
          type: 'agent' as const,
          name: agent.name,
          description: agent.description,
          href: `/app/agents/${agent.id}`,
        }))
      );
    }

    // Search workflows
    const { data: workflows, error: workflowsError } = await supabase
      .from('workflows')
      .select('id, name, description')
      .eq('owner_id', user.id)
      .or(`name.ilike."${searchPattern}",description.ilike."${searchPattern}"`)
      .limit(5);

    if (workflowsError) {
      console.error('Error searching workflows:', workflowsError);
    } else if (workflows) {
      results.push(
        ...workflows.map((workflow) => ({
          id: workflow.id,
          type: 'workflow' as const,
          name: workflow.name,
          description: workflow.description,
          href: `/app/workflows/${workflow.id}`,
        }))
      );
    }

    return { data: results, error: null };
  } catch (error) {
    console.error('Error in searchAll:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

