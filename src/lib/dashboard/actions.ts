/**
 * Dashboard Server Actions
 * Statistics and data for dashboard
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';

export interface DashboardStats {
  activeAgents: number;
  totalWorkflows: number;
  runsToday: number;
  successRate: number;
}

/**
 * Get dashboard statistics for the current user
 */
export async function getDashboardStats(): Promise<{
  data: DashboardStats | null;
  error: string | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Get active agents count
    // Workaround: Type inference issue with agents table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: activeAgentsCount } = await (supabase as any)
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'active') as { count: number | null; error: unknown };

    // Get total workflows count
    // Workaround: Type inference issue with workflows table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: workflowsCount } = await (supabase as any)
      .from('workflows')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id) as { count: number | null; error: unknown };

    // Get runs today count (runs created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Workaround: Type inference issue with workflow_runs table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: runsTodayCount } = await (supabase as any)
      .from('workflow_runs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)
      .gte('created_at', todayISO) as { count: number | null; error: unknown };

    // Get success rate (completed runs / total runs)
    // Workaround: Type inference issue with workflow_runs table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: totalRunsCount } = await (supabase as any)
      .from('workflow_runs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id) as { count: number | null; error: unknown };

    // Workaround: Type inference issue with workflow_runs table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: completedRunsCount } = await (supabase as any)
      .from('workflow_runs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)
      .eq('status', 'completed') as { count: number | null; error: unknown };

    const successRate =
      totalRunsCount && totalRunsCount > 0
        ? Math.round((completedRunsCount || 0) / totalRunsCount * 100)
        : 0;

    return {
      data: {
        activeAgents: activeAgentsCount || 0,
        totalWorkflows: workflowsCount || 0,
        runsToday: runsTodayCount || 0,
        successRate,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

