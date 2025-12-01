/**
 * Secure Error Handler
 * Prevents exposing sensitive information in error responses
 * Following SRP: Only handles secure error formatting
 */

'use server';

import type { ErrorCategory } from '@/lib/errors/error-handler';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sanitize error message for client response
 * Removes stack traces and sensitive information in production
 */
export function sanitizeErrorMessage(
  error: Error | unknown,
  category: ErrorCategory = 'unknown'
): string {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // In development, show more details
  if (!isProduction) {
    return errorObj.message;
  }
  
  // In production, return generic messages based on category
  const safeMessages: Record<ErrorCategory, string> = {
    authentication: 'Authentication failed. Please check your credentials.',
    authorization: 'You do not have permission to perform this action.',
    validation: 'Invalid input. Please check your data and try again.',
    not_found: 'The requested resource was not found.',
    rate_limit: 'Too many requests. Please try again later.',
    agent_execution: 'An error occurred while executing the agent.',
    workflow_execution: 'An error occurred while executing the workflow.',
    tool_execution: 'An error occurred while executing the tool.',
    openai_api: 'An error occurred while communicating with the AI service.',
    database: 'A database error occurred. Please try again.',
    network: 'A network error occurred. Please check your connection.',
    unknown: 'An unexpected error occurred. Please try again.',
  };
  
  return safeMessages[category] || safeMessages.unknown;
}

/**
 * Sanitize error response object
 * Removes stack traces and sensitive data in production
 */
export function sanitizeErrorResponse(
  error: Error | unknown,
  category: ErrorCategory = 'unknown',
  includeTechnicalDetails = false
): {
  message: string;
  code?: string;
  technicalDetails?: string;
} {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  const response: {
    message: string;
    code?: string;
    technicalDetails?: string;
  } = {
    message: sanitizeErrorMessage(errorObj, category),
  };
  
  // Only include technical details in development or if explicitly requested
  if (!isProduction || includeTechnicalDetails) {
    response.technicalDetails = errorObj.message;
    response.code = category.toUpperCase().replace('_', '-');
  }
  
  return response;
}

/**
 * Check if error contains sensitive information
 */
export function containsSensitiveInfo(error: Error | unknown): boolean {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const message = errorObj.message.toLowerCase();
  const stack = errorObj.stack?.toLowerCase() || '';
  
  const sensitivePatterns = [
    'password',
    'secret',
    'api_key',
    'apikey',
    'token',
    'credential',
    'private',
    'database',
    'connection string',
    'sql',
    'query',
    'stack trace',
  ];
  
  return sensitivePatterns.some(
    (pattern) => message.includes(pattern) || stack.includes(pattern)
  );
}

