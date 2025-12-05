/**
 * Structured Logger
 * Centralized logging system with Supabase storage
 * Following SRP: Only handles logging logic
 */

'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type {
  LogCategory,
  CreateLogInput,
  LogContext,
} from '@/types/logging.types';

/**
 * Create a structured log entry
 * This function writes to Supabase logs table
 */
export async function createLog(input: CreateLogInput): Promise<void> {
  try {
    const supabase = await createAdminClient();

    const logEntry = {
      level: input.level,
      category: input.category,
      message: input.message,
      context: (input.context || {}) as Record<string, unknown>,
      user_id: input.userId || null,
      agent_id: input.agentId || null,
      workflow_id: input.workflowId || null,
      workflow_run_id: input.workflowRunId || null,
      agent_run_id: input.agentRunId || null,
      error_type: input.errorType || null,
      error_message: input.errorMessage || null,
      stack_trace: input.stackTrace || null,
      request_id: input.requestId || null,
      duration_ms: input.durationMs || null,
    };

    // Type assertion needed because Supabase types may not be fully generated
    const { error } = await supabase.from('logs').insert(logEntry as never);

    if (error) {
      // Don't throw - logging should never break the application
      // Use console as fallback (console.error is allowed by no-console rule)
      console.error('[Logger] Failed to write log to database:', error);
      // eslint-disable-next-line no-console
      console.log('[Logger] Log entry (fallback):', logEntry);
    }
  } catch (error) {
    // Silent fail - log to console only
    // console.error is allowed by no-console rule
    console.error('[Logger] Unexpected error writing log:', error);
    // eslint-disable-next-line no-console
    console.log('[Logger] Log entry (fallback):', input);
  }
}

/**
 * Helper function to create error logs with stack trace
 */
export async function logError(
  category: LogCategory,
  message: string,
  error: Error | unknown,
  context?: LogContext
): Promise<void> {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  await createLog({
    level: 'error',
    category,
    message,
    context,
    errorType: errorObj.name,
    errorMessage: errorObj.message,
    stackTrace: errorObj.stack,
  });
}

/**
 * Helper function to create critical error logs
 */
export async function logCritical(
  category: LogCategory,
  message: string,
  error: Error | unknown,
  context?: LogContext
): Promise<void> {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  await createLog({
    level: 'critical',
    category,
    message,
    context,
    errorType: errorObj.name,
    errorMessage: errorObj.message,
    stackTrace: errorObj.stack,
  });
}

/**
 * Helper function for info logs
 */
export async function logInfo(
  category: LogCategory,
  message: string,
  context?: LogContext
): Promise<void> {
  await createLog({
    level: 'info',
    category,
    message,
    context,
  });
}

/**
 * Helper function for warning logs
 */
export async function logWarn(
  category: LogCategory,
  message: string,
  context?: LogContext
): Promise<void> {
  await createLog({
    level: 'warn',
    category,
    message,
    context,
  });
}

/**
 * Helper function for debug logs
 */
export async function logDebug(
  category: LogCategory,
  message: string,
  context?: LogContext
): Promise<void> {
  await createLog({
    level: 'debug',
    category,
    message,
    context,
  });
}


