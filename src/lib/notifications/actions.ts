/**
 * Notifications Server Actions
 * Fetch and manage user notifications
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import type { Notification } from '@/types/notification.types';


/**
 * Get recent notifications for the current user
 * Generates notifications from recent workflow runs and system events
 */
export async function getNotifications(): Promise<{
  data: Notification[] | null;
  error: string | null;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: 'Unauthorized' };
    }

    const supabase = await createClient();
    const notifications: Notification[] = [];

    // Get recent workflow runs (last 24 hours) for notifications
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const oneDayAgoISO = oneDayAgo.toISOString();

    const { data: recentRuns, error: runsError } = await supabase
      .from('workflow_runs')
      .select(
        `
        id,
        status,
        workflow_id,
        created_at,
        finished_at,
        workflows!inner(name)
      `
      )
      .eq('created_by', user.id)
      .gte('created_at', oneDayAgoISO)
      .order('created_at', { ascending: false })
      .limit(20);

    if (runsError) {
      console.error('Error fetching workflow runs for notifications:', runsError);
    } else if (recentRuns) {
      // Create notifications from workflow runs
      for (const run of recentRuns) {
        const workflow = run.workflows as { name: string } | { name: string }[] | null;
        const workflowName = Array.isArray(workflow) 
          ? workflow[0]?.name 
          : workflow?.name 
          || 'Unknown Workflow';

        if (run.status === 'completed') {
          notifications.push({
            id: `workflow-${run.id}-completed`,
            type: 'workflow_completed',
            title: 'Workflow Completed',
            message: `"${workflowName}" has completed successfully`,
            href: `/app/runs/${run.id}`,
            createdAt: run.finished_at || run.created_at,
            read: false, // TODO: implement read status tracking
          });
        } else if (run.status === 'failed') {
          notifications.push({
            id: `workflow-${run.id}-failed`,
            type: 'workflow_failed',
            title: 'Workflow Failed',
            message: `"${workflowName}" has failed`,
            href: `/app/runs/${run.id}`,
            createdAt: run.finished_at || run.created_at,
            read: false,
          });
        } else if (run.status === 'running') {
          notifications.push({
            id: `workflow-${run.id}-started`,
            type: 'workflow_started',
            title: 'Workflow Started',
            message: `"${workflowName}" is now running`,
            href: `/app/runs/${run.id}`,
            createdAt: run.created_at,
            read: false,
          });
        }
      }
    }

    // Check for integration errors (e.g., Google Calendar disconnections)
    const { data: credentials, error: credsError } = await supabase
      .from('stored_credentials')
      .select('id, provider, created_at, updated_at')
      .eq('user_id', user.id)
      .eq('provider', 'google_calendar');

    // TODO: Add logic to detect expired/invalid credentials
    // For now, we'll skip integration error notifications

    // Sort notifications by creation date (newest first)
    notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { data: notifications.slice(0, 10), error: null };
  } catch (error) {
    console.error('Error in getNotifications:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Get count of unread notifications
 */
export async function getUnreadNotificationCount(): Promise<{
  data: number | null;
  error: string | null;
}> {
  try {
    const result = await getNotifications();
    if (result.error || !result.data) {
      return { data: null, error: result.error };
    }

    const unreadCount = result.data.filter((n) => !n.read).length;
    return { data: unreadCount, error: null };
  } catch (error) {
    console.error('Error in getUnreadNotificationCount:', error);
    return { data: null, error: 'An unexpected error occurred' };
  }
}

