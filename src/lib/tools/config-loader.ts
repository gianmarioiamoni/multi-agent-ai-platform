/**
 * Tool Configuration Loader
 * Loads tool configurations from database with fallback to environment variables
 * Following SRP: Only handles config loading logic
 */

'use server';

import { getToolConfig } from '@/lib/admin/tool-config-actions';
import type {
  EmailToolConfig,
  WebSearchToolConfig,
  OpenAIToolConfig,
} from '@/types/tool-config.types';

/**
 * Get email tool configuration from database or env vars (fallback)
 * Priority order:
 * 1. Gmail (GMAIL_USER + GMAIL_APP_PASSWORD) - simplest configuration
 * 2. Generic SMTP (SMTP_HOST + SMTP_PORT + SMTP_USER + SMTP_PASSWORD)
 * 3. API-based providers (EMAIL_API_KEY + EMAIL_FROM)
 * 4. Database configuration
 */
export async function getEmailToolConfig(): Promise<EmailToolConfig | null> {
  // Priority 1: Check for Gmail configuration (simplest)
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    return {
      provider: 'smtp',
      enabled: true,
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: gmailUser,
      smtp_password: gmailAppPassword,
      smtp_from_email: gmailUser,
    };
  }

  // Priority 2: Check for generic SMTP configuration
  const provider = process.env.EMAIL_PROVIDER || 'smtp';

  if (provider === 'smtp') {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM_EMAIL || smtpUser;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      return {
        provider: 'smtp',
        enabled: true,
        smtp_host: smtpHost,
        smtp_port: parseInt(smtpPort, 10),
        smtp_user: smtpUser,
        smtp_password: smtpPass,
        smtp_from_email: smtpFrom || undefined,
      };
    }
  } else {
    // Priority 3: API-based provider (Resend, SendGrid, Mailgun)
    const apiKey = process.env.EMAIL_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_FROM_EMAIL;

    if (apiKey && fromEmail) {
      return {
        provider: provider as EmailToolConfig['provider'],
        enabled: true,
        api_key: apiKey,
        from_email: fromEmail,
      };
    }
  }

  // Priority 4: If env vars are not available, try database (with error handling)
  try {
    const { data: dbConfig } = await getToolConfig('email');

    if (dbConfig && dbConfig.enabled) {
      return dbConfig.config as unknown as EmailToolConfig;
    }
  } catch (_error) {
    // If database query fails, continue and return null
    // This allows the system to work even if DB is temporarily unavailable
    console.warn('[Config Loader] Could not load email config from database, using env vars only:', _error);
  }

  return null;
}

/**
 * Get web search tool configuration from database or env vars (fallback)
 */
export async function getWebSearchToolConfig(): Promise<WebSearchToolConfig | null> {
  try {
    // Try to get from database first
    const { data: dbConfig } = await getToolConfig('web_search');

    if (dbConfig && dbConfig.enabled) {
      return dbConfig.config as unknown as WebSearchToolConfig;
    }

    // Fallback to environment variables (for backward compatibility)
    const apiKey = process.env.TAVILY_API_KEY;

    if (apiKey) {
      return {
        provider: 'tavily',
        enabled: true,
        api_key: apiKey,
        max_results: 5,
      };
    }

    return null;
  } catch (_error) {
    console.error('[Config Loader] Error loading web search config:', _error instanceof Error ? _error : new Error(String(_error)));
    return null;
  }
}

/**
 * Get OpenAI tool configuration from database or env vars (fallback)
 */
export async function getOpenAIToolConfig(): Promise<OpenAIToolConfig | null> {
  try {
    // Try to get from database first
    const { data: dbConfig } = await getToolConfig('openai');

    if (dbConfig && dbConfig.enabled) {
      return dbConfig.config as unknown as OpenAIToolConfig;
    }

    // Fallback to environment variables (for backward compatibility)
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      return {
        enabled: true,
        api_key: apiKey,
        default_model: 'gpt-4o-mini',
        rate_limit_per_user_per_hour: 100,
        max_tokens_per_request: 4000,
      };
    }

    return null;
  } catch (_error) {
    console.error('[Config Loader] Error loading OpenAI config:', _error);
    return null;
  }
}

