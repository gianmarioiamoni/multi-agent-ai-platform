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
    const { count: activeAgentsCount } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'active');

    // Get total workflows count
    const { count: workflowsCount } = await supabase
      .from('workflows')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id);

    // Get runs today count (runs created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const { count: runsTodayCount } = await supabase
      .from('workflow_runs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)
      .gte('created_at', todayISO);

    // Get success rate (completed runs / total runs)
    const { count: totalRunsCount } = await supabase
      .from('workflow_runs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id);

    const { count: completedRunsCount } = await supabase
      .from('workflow_runs')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', user.id)
      .eq('status', 'completed');

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

