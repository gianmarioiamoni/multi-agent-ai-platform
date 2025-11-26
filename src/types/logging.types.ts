/**
 * Logging Types
 * Type definitions for structured logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export type LogCategory =
  | 'agent.execution'
  | 'agent.error'
  | 'workflow.engine'
  | 'workflow.error'
  | 'tool.calendar'
  | 'tool.email'
  | 'tool.web_search'
  | 'tool.db_ops'
  | 'tool.error'
  | 'rate_limit'
  | 'auth'
  | 'api'
  | 'database'
  | 'system';

export interface LogContext {
  [key: string]: unknown;
}

export interface CreateLogInput {
  level: LogLevel;
  category: LogCategory;
  message: string;
  context?: LogContext;
  userId?: string;
  agentId?: string;
  workflowId?: string;
  workflowRunId?: string;
  agentRunId?: string;
  errorType?: string;
  errorMessage?: string;
  stackTrace?: string;
  requestId?: string;
  durationMs?: number;
}

export interface Log {
  id: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  context: LogContext;
  userId?: string;
  agentId?: string;
  workflowId?: string;
  workflowRunId?: string;
  agentRunId?: string;
  errorType?: string;
  errorMessage?: string;
  stackTrace?: string;
  requestId?: string;
  durationMs?: number;
  createdAt: string;
}

