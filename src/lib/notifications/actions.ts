/**
 * Notifications Server Actions
 * Fetch and manage user notifications
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import { hasNotificationEnabled } from '@/lib/settings/utils';
import type { Notification } from '@/types/notification.types';


/**
 * Get recent notifications for the current user
 * Generates notifications from recent workflow runs and system events
 * Includes read status from database
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
    const notificationIds: string[] = [];

    // Get recent workflow runs (last 24 hours) for notifications
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const oneDayAgoISO = oneDayAgo.toISOString();

    // Workaround: Type inference issue with workflow_runs table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: recentRuns, error: runsError } = await (supabase as any)
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
      .limit(20) as { data: Array<{ workflows: { name: string } | { name: string }[] | null; id: string; status: string; workflow_id: string; created_at: string; finished_at: string | null }> | null; error: unknown };

    if (runsError) {
      console.error('Error fetching workflow runs for notifications:', runsError);
    } else if (recentRuns) {
      // Check if user has workflow run notifications enabled
      const workflowNotificationsEnabled = await hasNotificationEnabled('workflowRuns');
      
      // Create notifications from workflow runs only if enabled
      if (workflowNotificationsEnabled) {
        for (const run of recentRuns) {
          const workflow = run.workflows as { name: string } | { name: string }[] | null;
          const workflowName = Array.isArray(workflow) 
            ? workflow[0]?.name 
            : workflow?.name 
            || 'Unknown Workflow';

          if (run.status === 'completed') {
            const notificationId = `workflow-${run.id}-completed`;
            notificationIds.push(notificationId);
            notifications.push({
              id: notificationId,
              type: 'workflow_completed',
              title: 'Workflow Completed',
              message: `"${workflowName}" has completed successfully`,
              href: `/app/runs/${run.id}`,
              createdAt: run.finished_at || run.created_at,
              read: false, // Will be updated below
            });
          } else if (run.status === 'failed') {
            const notificationId = `workflow-${run.id}-failed`;
            notificationIds.push(notificationId);
            notifications.push({
              id: notificationId,
              type: 'workflow_failed',
              title: 'Workflow Failed',
              message: `"${workflowName}" has failed`,
              href: `/app/runs/${run.id}`,
              createdAt: run.finished_at || run.created_at,
              read: false,
            });
          } else if (run.status === 'running') {
            const notificationId = `workflow-${run.id}-started`;
            notificationIds.push(notificationId);
            notifications.push({
              id: notificationId,
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
    }

    // Get agent run notifications if enabled
    const agentNotificationsEnabled = await hasNotificationEnabled('agentRuns');
    
    if (agentNotificationsEnabled) {
      // Get recent agent runs from workflow runs (last 24 hours)
      // We need to join through workflow_runs to get the user and workflow name
      // Workaround: Type inference issue with agent_runs table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: agentRuns, error: agentRunsError } = await (supabase as any)
        .from('agent_runs')
        .select(
          `
          id,
          status,
          workflow_run_id,
          created_at,
          finished_at,
          workflow_runs!inner(
            id,
            created_by,
            workflows!inner(name)
          )
        `
        )
        .eq('workflow_runs.created_by', user.id)
        .gte('agent_runs.created_at', oneDayAgoISO)
        .order('agent_runs.created_at', { ascending: false })
        .limit(10) as { data: Array<{ id: string; status: string; workflow_run_id: string; created_at: string; finished_at: string | null; workflow_runs: { id: string; created_by: string; workflows: { name: string } | { name: string }[] | null } }> | null; error: unknown };

      if (!agentRunsError && agentRuns) {
        for (const run of agentRuns) {
          const workflowRun = run.workflow_runs as {
            id: string;
            created_by: string;
            workflows: { name: string } | { name: string }[] | null;
          };
          
          const workflowName = Array.isArray(workflowRun.workflows)
            ? workflowRun.workflows[0]?.name
            : workflowRun.workflows?.name
            || 'Unknown Workflow';

          if (run.status === 'completed') {
            const notificationId = `agent-${run.id}-completed`;
            notificationIds.push(notificationId);
            notifications.push({
              id: notificationId,
              type: 'agent_completed',
              title: 'Agent Run Completed',
              message: `Agent in "${workflowName}" has completed successfully`,
              href: `/app/runs/${workflowRun.id}`,
              createdAt: run.finished_at || run.created_at,
              read: false,
            });
          } else if (run.status === 'failed') {
            const notificationId = `agent-${run.id}-failed`;
            notificationIds.push(notificationId);
            notifications.push({
              id: notificationId,
              type: 'agent_failed',
              title: 'Agent Run Failed',
              message: `Agent in "${workflowName}" has failed`,
              href: `/app/runs/${workflowRun.id}`,
              createdAt: run.finished_at || run.created_at,
              read: false,
            });
          }
        }
      }
    }

    // Fetch read status for all notifications (workflow + agent runs) after collecting them all
    if (notificationIds.length > 0) {
      // Workaround: Type inference issue with notification_reads table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: readNotifications, error: readError } = await (supabase as any)
        .from('notification_reads')
        .select('notification_id')
        .eq('user_id', user.id)
        .in('notification_id', notificationIds) as { data: Array<{ notification_id: string }> | null; error: unknown };

      if (!readError && readNotifications) {
        const readIdsSet = new Set(readNotifications.map((r) => r.notification_id));
        notifications.forEach((notification) => {
          notification.read = readIdsSet.has(notification.id);
        });
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

/**
 * Mark a notification as read in the database
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const supabase = await createClient();

    // Insert read status (using ON CONFLICT to handle duplicates gracefully)
    // Workaround: Type inference issue with notification_reads table - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('notification_reads')
      .insert({
        user_id: user.id,
        notification_id: notificationId,
      })
      .select()
      .single();

    if (error) {
      // If it's a unique constraint violation, the notification is already marked as read
      if (error.code === '23505') {
        return { error: null };
      }
      console.error('Error marking notification as read:', error);
      return { error: 'Failed to mark notification as read' };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Mark multiple notifications as read
 */
export async function markNotificationsAsRead(
  notificationIds: string[]
): Promise<{ error: string | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    if (notificationIds.length === 0) {
      return { error: null };
    }

    const supabase = await createClient();

    // Insert read statuses one by one to handle duplicates gracefully
    // If a notification is already marked as read (unique constraint violation),
    // we simply ignore that error and continue
    let hasError = false;
    const errors: string[] = [];

    for (const notificationId of notificationIds) {
      // Workaround: Type inference issue with notification_reads table - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('notification_reads')
        .insert({
          user_id: user.id,
          notification_id: notificationId,
        });

      if (error) {
        // If it's a unique constraint violation, the notification is already marked as read - ignore
        if (error.code !== '23505') {
          hasError = true;
          errors.push(error.message);
        }
      }
    }

    if (hasError) {
      console.error('Error marking notifications as read:', errors);
      return { error: 'Failed to mark some notifications as read' };
    }

    return { error: null };
  } catch (error) {
    console.error('Error in markNotificationsAsRead:', error);
    return { error: 'An unexpected error occurred' };
  }
}

