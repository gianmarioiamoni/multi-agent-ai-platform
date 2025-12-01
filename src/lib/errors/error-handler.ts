/**
 * Error Handler Utilities
 * Centralized error handling with clear, user-friendly messages
 * Following SRP: Only handles error processing and message formatting
 */

import type { LogCategory } from '@/types/logging.types';
import { logError } from '@/lib/logging/logger';
import { sanitizeErrorResponse, containsSensitiveInfo } from '@/lib/security/secure-error-handler';

export type ErrorCategory =
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'not_found'
  | 'rate_limit'
  | 'agent_execution'
  | 'workflow_execution'
  | 'tool_execution'
  | 'openai_api'
  | 'database'
  | 'network'
  | 'unknown';

export interface ErrorDetails {
  category: ErrorCategory;
  userMessage: string;
  technicalMessage?: string;
  code?: string;
  logCategory: LogCategory;
  context?: Record<string, unknown>;
}

/**
 * Create a user-friendly error message based on error type
 */
export function createUserFriendlyError(
  error: Error | unknown,
  category: ErrorCategory = 'unknown',
  context?: Record<string, unknown>
): ErrorDetails {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const errorMessage = errorObj.message.toLowerCase();

  // Map error messages to user-friendly text
  const errorMappings: Record<string, ErrorDetails> = {
    // Authentication
    'authentication required':
      {
        category: 'authentication',
        userMessage: 'You must be logged in to perform this action.',
        technicalMessage: errorObj.message,
        code: 'AUTH_REQUIRED',
        logCategory: 'auth',
      },
    'unauthorized':
      {
        category: 'authorization',
        userMessage: 'You do not have permission to perform this action.',
        technicalMessage: errorObj.message,
        code: 'UNAUTHORIZED',
        logCategory: 'auth',
      },
    // Not found
    'agent not found':
      {
        category: 'not_found',
        userMessage: 'The requested agent could not be found.',
        technicalMessage: errorObj.message,
        code: 'AGENT_NOT_FOUND',
        logCategory: 'agent.error',
      },
    'workflow not found':
      {
        category: 'not_found',
        userMessage: 'The requested workflow could not be found.',
        technicalMessage: errorObj.message,
        code: 'WORKFLOW_NOT_FOUND',
        logCategory: 'workflow.error',
      },
    // Rate limiting
    'rate limit exceeded':
      {
        category: 'rate_limit',
        userMessage: errorObj.message, // Already user-friendly
        technicalMessage: errorObj.message,
        code: 'RATE_LIMIT_EXCEEDED',
        logCategory: 'rate_limit',
      },
    // Validation
    'user message is required':
      {
        category: 'validation',
        userMessage: 'Please provide a message to send to the agent.',
        technicalMessage: errorObj.message,
        code: 'VALIDATION_ERROR',
        logCategory: 'agent.execution',
      },
    'agent is not active':
      {
        category: 'validation',
        userMessage: 'This agent is currently inactive. Please activate it before running.',
        technicalMessage: errorObj.message,
        code: 'AGENT_INACTIVE',
        logCategory: 'agent.execution',
      },
    // OpenAI API errors
    'openai':
      {
        category: 'openai_api',
        userMessage: 'There was an issue communicating with the AI service. Please try again.',
        technicalMessage: errorObj.message,
        code: 'OPENAI_ERROR',
        logCategory: 'agent.execution',
      },
    'timeout':
      {
        category: 'network',
        userMessage: 'The request took too long to complete. Please try again.',
        technicalMessage: errorObj.message,
        code: 'TIMEOUT',
        logCategory: 'agent.execution',
      },
    // Database errors
    'database':
      {
        category: 'database',
        userMessage: 'A database error occurred. Please try again or contact support.',
        technicalMessage: errorObj.message,
        code: 'DATABASE_ERROR',
        logCategory: 'database',
      },
  };

  // Check for partial matches
  for (const [key, details] of Object.entries(errorMappings)) {
    if (errorMessage.includes(key)) {
      return {
        ...details,
        context: { ...details.context, ...context, originalError: errorObj.message },
      };
    }
  }

  // Default error
  return {
    category,
    userMessage: 'An unexpected error occurred. Please try again.',
    technicalMessage: errorObj.message,
    code: 'UNKNOWN_ERROR',
    logCategory: category === 'agent_execution' ? 'agent.error' : category === 'workflow_execution' ? 'workflow.error' : 'system',
    context: { ...context, originalError: errorObj.message, stack: errorObj.stack },
  };
}

/**
 * Handle and log an error, returning user-friendly message
 */
export async function handleError(
  error: Error | unknown,
  category: ErrorCategory = 'unknown',
  context?: Record<string, unknown>
): Promise<string> {
  const errorDetails = createUserFriendlyError(error, category, context);

  // Log the error
  await logError(
    errorDetails.logCategory,
    errorDetails.technicalMessage || errorDetails.userMessage,
    error instanceof Error ? error : new Error(String(error)),
    errorDetails.context
  );

  return errorDetails.userMessage;
}

/**
 * Create a standardized error response
 * Uses secure error handler to prevent exposing sensitive information
 */
export function createErrorResponse(
  error: Error | unknown,
  category: ErrorCategory = 'unknown',
  includeTechnicalDetails = false
) {
  const sanitized = sanitizeErrorResponse(error, category, includeTechnicalDetails);
  
  // Remove sensitive details in production
  const details = containsSensitiveInfo(error) && process.env.NODE_ENV === 'production'
    ? undefined
    : { category };
  
  return {
    success: false as const,
    error: sanitized.message,
    technicalMessage: sanitized.technicalDetails,
    code: sanitized.code,
    details,
  };
}

