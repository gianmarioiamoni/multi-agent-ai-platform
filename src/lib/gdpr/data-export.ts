/**
 * GDPR Data Export
 * Implements Right to Access (Article 15) and Right to Data Portability (Article 20)
 * Exports all user data in a structured, machine-readable format (JSON)
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/utils';
import type { Database } from '@/types/database.types';
import type { DatabaseEntityArray, DatabaseQueryResult } from '@/types/common.types';

export type ExportedUserData = {
  export_metadata: {
    export_date: string;
    user_id: string;
    format_version: string;
  };
  profile: {
    id: string;
    name: string | null;
    role: string;
    settings: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
  };
  agents: Array<{
    id: string;
    name: string;
    description: string | null;
    role: string;
    model: string;
    temperature: number;
    max_tokens: number;
    tools_enabled: string[];
    status: string;
    config: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  }>;
  workflows: Array<{
    id: string;
    name: string;
    description: string | null;
    graph: Record<string, unknown>;
    status: string;
    created_at: string;
    updated_at: string;
    last_run_at: string | null;
  }>;
  workflow_runs: Array<{
    id: string;
    workflow_id: string;
    status: string;
    input: string | null;
    output: string | null;
    error: string | null;
    started_at: string | null;
    finished_at: string | null;
    created_at: string;
    updated_at: string;
  }>;
  agent_runs: Array<{
    id: string;
    workflow_run_id: string;
    agent_id: string;
    status: string;
    step_order: number;
    input: string | null;
    output: string | null;
    error: string | null;
    started_at: string | null;
    finished_at: string | null;
    created_at: string;
    updated_at: string;
  }>;
  tool_invocations: Array<{
    id: string;
    agent_run_id: string;
    tool: string;
    params: Record<string, unknown>;
    status: string;
    result: Record<string, unknown> | null;
    error: string | null;
    started_at: string | null;
    finished_at: string | null;
    execution_time_ms: number | null;
    created_at: string;
    updated_at: string;
  }>;
  stored_credentials: Array<{
    id: string;
    provider: string;
    is_active: boolean;
    expires_at: string | null;
    scopes: string[];
    created_at: string;
    updated_at: string;
    // Note: encrypted_data is NOT exported for security reasons
  }>;
  logs: Array<{
    id: string;
    level: string;
    category: string;
    message: string;
    context: Record<string, unknown>;
    error_type: string | null;
    error_message: string | null;
    request_id: string | null;
    duration_ms: number | null;
    created_at: string;
  }>;
  notification_reads: Array<{
    id: string;
    notification_id: string;
    read_at: string;
    created_at: string;
  }>;
};

/**
 * Export all user data for GDPR compliance
 * Returns structured JSON data including all personal information
 */
export async function exportUserData(): Promise<ExportedUserData | { error: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const supabase = await createClient();

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single() as {
      data: { id: string; name: string | null; role: string; settings: unknown; created_at: string; updated_at: string } | null;
      error: unknown;
    };

    if (profileError || !profile) {
      return { error: 'Failed to fetch profile data' };
    }

    // Get all user agents
    const { data: agents } = await supabase
      .from('agents')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false }) as DatabaseQueryResult;

    // Get all user workflows
    const { data: workflows } = await supabase
      .from('workflows')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false }) as DatabaseQueryResult<{ id: string }>;

    // Get all workflow runs for user's workflows
    const workflowIds = workflows?.map((w) => w.id) || [];
    const workflowRunsResult = workflowIds.length > 0
      ? await supabase
          .from('workflow_runs')
          .select('*')
          .in('workflow_id', workflowIds)
          .eq('created_by', user.id)
          .order('created_at', { ascending: false }) as DatabaseQueryResult<{ id: string }>
      : { data: [] };
    const workflowRuns = workflowRunsResult.data;

    // Get all agent runs for user's workflow runs
    const workflowRunIds = workflowRuns?.map((wr) => wr.id) || [];
    const agentRunsResult = workflowRunIds.length > 0
      ? await supabase
          .from('agent_runs')
          .select('*')
          .in('workflow_run_id', workflowRunIds)
          .order('step_order', { ascending: true }) as DatabaseQueryResult<{ id: string }>
      : { data: [] };
    const agentRuns = agentRunsResult.data;

    // Get all tool invocations for user's agent runs
    const agentRunIds = agentRuns?.map((ar) => ar.id) || [];
    const { data: toolInvocations } = agentRunIds.length > 0
      ? await supabase
          .from('tool_invocations')
          .select('*')
          .in('agent_run_id', agentRunIds)
          .order('created_at', { ascending: false })
      : { data: [] };

    // Get stored credentials (metadata only, no encrypted data)
    const { data: storedCredentials } = await supabase
      .from('stored_credentials')
      .select('id, provider, is_active, expires_at, scopes, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get user logs
    const { data: logs } = await supabase
      .from('logs')
      .select('id, level, category, message, context, error_type, error_message, request_id, duration_ms, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1000); // Limit to last 1000 logs to prevent huge exports

    // Get notification reads
    const { data: notificationReads } = await supabase
      .from('notification_reads')
      .select('*')
      .eq('user_id', user.id)
      .order('read_at', { ascending: false });

    // Build export data structure
    const exportData: ExportedUserData = {
      export_metadata: {
        export_date: new Date().toISOString(),
        user_id: user.id,
        format_version: '1.0',
      },
      profile: {
        id: profile.id,
        name: profile.name,
        role: profile.role,
        settings: profile.settings as Record<string, unknown> | null,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
      agents: ((agents as DatabaseEntityArray) || []).map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        role: agent.role,
        model: agent.model,
        temperature: agent.temperature,
        max_tokens: agent.max_tokens,
        tools_enabled: agent.tools_enabled,
        status: agent.status,
        config: agent.config as Record<string, unknown>,
        created_at: agent.created_at,
        updated_at: agent.updated_at,
      })),
      workflows: ((workflows as DatabaseEntityArray) || []).map((workflow: any) => ({
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        graph: workflow.graph as Record<string, unknown>,
        status: workflow.status,
        created_at: workflow.created_at,
        updated_at: workflow.updated_at,
        last_run_at: workflow.last_run_at,
      })),
      workflow_runs: ((workflowRuns as DatabaseEntityArray) || []).map((run: any) => ({
        id: run.id,
        workflow_id: run.workflow_id,
        status: run.status,
        input: run.input,
        output: run.output,
        error: run.error,
        started_at: run.started_at,
        finished_at: run.finished_at,
        created_at: run.created_at,
        updated_at: run.updated_at,
      })),
      agent_runs: ((agentRuns as DatabaseEntityArray) || []).map((run: any) => ({
        id: run.id,
        workflow_run_id: run.workflow_run_id,
        agent_id: run.agent_id,
        status: run.status,
        step_order: run.step_order,
        input: run.input,
        output: run.output,
        error: run.error,
        started_at: run.started_at,
        finished_at: run.finished_at,
        created_at: run.created_at,
        updated_at: run.updated_at,
      })),
      tool_invocations: ((toolInvocations as DatabaseEntityArray) || []).map((inv: any) => ({
        id: inv.id,
        agent_run_id: inv.agent_run_id,
        tool: inv.tool,
        params: inv.params as Record<string, unknown>,
        status: inv.status,
        result: inv.result as Record<string, unknown> | null,
        error: inv.error,
        started_at: inv.started_at,
        finished_at: inv.finished_at,
        execution_time_ms: inv.execution_time_ms,
        created_at: inv.created_at,
        updated_at: inv.updated_at,
      })),
      stored_credentials: (storedCredentials || []).map((cred: {
        id: string;
        provider: string;
        is_active: boolean;
        expires_at: string | null;
        scopes: string[] | null;
        created_at: string;
        updated_at: string;
      }) => ({
        id: cred.id,
        provider: cred.provider,
        is_active: cred.is_active,
        expires_at: cred.expires_at,
        scopes: cred.scopes || [],
        created_at: cred.created_at,
        updated_at: cred.updated_at,
      })),
      logs: ((logs as DatabaseEntityArray) || []).map((log: any) => ({
        id: log.id,
        level: log.level,
        category: log.category,
        message: log.message,
        context: log.context as Record<string, unknown>,
        error_type: log.error_type,
        error_message: log.error_message,
        request_id: log.request_id,
        duration_ms: log.duration_ms,
        created_at: log.created_at,
      })),
      notification_reads: ((notificationReads as DatabaseEntityArray) || []).map((nr: any) => ({
        id: nr.id,
        notification_id: nr.notification_id,
        read_at: nr.read_at,
        created_at: nr.created_at,
      })),
    };

    return exportData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to export user data',
    };
  }
}

