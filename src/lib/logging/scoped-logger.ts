/**
 * Scoped Logger Factory
 * Creates logger instances with default context
 * This file does NOT have 'use server' because it's a utility function, not a server action
 */

import { createLog, logError, logInfo, logWarn, logDebug } from './logger';
import type {
  LogCategory,
  CreateLogInput,
  LogContext,
} from '@/types/logging.types';

/**
 * Create a logger with default context
 * Useful for scoped logging (e.g., per request, per workflow run)
 * This is a synchronous factory function, not a server action
 */
export function createScopedLogger(defaultContext: Partial<CreateLogInput>) {
  return {
    log: (input: Omit<CreateLogInput, keyof typeof defaultContext> & Partial<CreateLogInput>) =>
      createLog({ ...defaultContext, ...input } as CreateLogInput),
    error: (
      message: string,
      error: Error | unknown,
      context?: LogContext
    ) =>
      logError(
        (defaultContext.category as LogCategory) || 'system',
        message,
        error,
        { ...defaultContext.context, ...context } as LogContext
      ),
    info: (message: string, context?: LogContext) =>
      logInfo(
        (defaultContext.category as LogCategory) || 'system',
        message,
        { ...defaultContext.context, ...context } as LogContext
      ),
    warn: (message: string, context?: LogContext) =>
      logWarn(
        (defaultContext.category as LogCategory) || 'system',
        message,
        { ...defaultContext.context, ...context } as LogContext
      ),
    debug: (message: string, context?: LogContext) =>
      logDebug(
        (defaultContext.category as LogCategory) || 'system',
        message,
        { ...defaultContext.context, ...context } as LogContext
      ),
  };
}

