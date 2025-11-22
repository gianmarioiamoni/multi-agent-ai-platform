/**
 * Tool Types
 * Type definitions for agent tools
 */

import type { ToolId } from './agent.types';

// Tool execution result
export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime?: number; // in milliseconds
}

// Base tool interface
export interface Tool<TParams = unknown, TResult = unknown> {
  id: ToolId;
  name: string;
  description: string;
  
  // JSON schema for parameters (for function calling)
  paramsSchema: Record<string, unknown>;
  
  // Handler function
  execute: (params: TParams) => Promise<ToolResult<TResult>>;
}

// ============================================================================
// Web Search Tool
// ============================================================================

export interface WebSearchParams {
  query: string;
  maxResults?: number;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export interface WebSearchData {
  query: string;
  results: WebSearchResult[];
  totalResults: number;
}

// ============================================================================
// Email Tool (Coming Soon)
// ============================================================================

export interface EmailParams {
  to: string;
  subject: string;
  body: string;
  html?: boolean;
}

export interface EmailData {
  messageId: string;
  timestamp: string;
}

// ============================================================================
// Calendar Tool (Coming Soon)
// ============================================================================

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees?: string[];
}

export interface ListEventsParams {
  startDate?: string;
  endDate?: string;
  maxResults?: number;
}

export interface CreateEventParams {
  title: string;
  start: string;
  end: string;
  description?: string;
  attendees?: string[];
}

// ============================================================================
// Database Operations Tool (Coming Soon)
// ============================================================================

export interface DbQueryParams {
  operation: 'get' | 'create' | 'update' | 'delete';
  table: string;
  data?: Record<string, unknown>;
  filters?: Record<string, unknown>;
}

// Tool invocation log (for database)
export interface ToolInvocation {
  id: string;
  agent_run_id: string;
  tool: ToolId;
  params: Record<string, unknown>;
  result: ToolResult;
  status: 'success' | 'error';
  execution_time: number;
  created_at: string;
}

