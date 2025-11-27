/**
 * Tool Configuration Types
 * Types for global tool configurations managed by admin
 */

import type { Json } from './database.types';

export type ToolId = 'email' | 'web_search' | 'openai';

export interface ToolConfigBase {
  enabled: boolean;
}

// Email Tool Configuration
export interface EmailToolConfig extends ToolConfigBase {
  provider: 'smtp' | 'resend' | 'sendgrid' | 'mailgun';
  // For SMTP
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_password?: string;
  smtp_from_email?: string;
  // For Resend/SendGrid/Mailgun
  api_key?: string;
  from_email?: string;
}

// Web Search Tool Configuration
export interface WebSearchToolConfig extends ToolConfigBase {
  provider: 'tavily' | 'serpapi' | 'custom';
  api_key: string;
  // Additional provider-specific config
  max_results?: number;
}

// OpenAI Tool Configuration
export interface OpenAIToolConfig extends ToolConfigBase {
  api_key: string;
  default_model?: string;
  rate_limit_per_user_per_hour?: number;
  max_tokens_per_request?: number;
}

export type ToolConfig = EmailToolConfig | WebSearchToolConfig | OpenAIToolConfig;

export interface ToolConfigRow {
  id: string;
  tool_id: ToolId;
  config: Json;
  enabled: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateToolConfigInput {
  tool_id: ToolId;
  config: ToolConfig;
  enabled?: boolean;
}

export interface UpdateToolConfigInput {
  config?: Partial<ToolConfig>;
  enabled?: boolean;
}

