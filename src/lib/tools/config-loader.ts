/**
 * Tool Configuration Loader
 * Loads tool configurations from database with fallback to environment variables
 * Following SRP: Only handles config loading logic
 */

'use server';

import { getToolConfig } from '@/lib/admin/tool-config-actions';
import type {
  ToolId,
  EmailToolConfig,
  WebSearchToolConfig,
  OpenAIToolConfig,
} from '@/types/tool-config.types';

/**
 * Get email tool configuration from database or env vars (fallback)
 */
export async function getEmailToolConfig(): Promise<EmailToolConfig | null> {
  try {
    // Try to get from database first
    const { data: dbConfig } = await getToolConfig('email');

    if (dbConfig && dbConfig.enabled) {
      return dbConfig.config as EmailToolConfig;
    }

    // Fallback to environment variables (for backward compatibility)
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
      // API-based provider (Resend, SendGrid, Mailgun)
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

    return null;
  } catch (error) {
    console.error('[Config Loader] Error loading email config:', error);
    return null;
  }
}

/**
 * Get web search tool configuration from database or env vars (fallback)
 */
export async function getWebSearchToolConfig(): Promise<WebSearchToolConfig | null> {
  try {
    // Try to get from database first
    const { data: dbConfig } = await getToolConfig('web_search');

    if (dbConfig && dbConfig.enabled) {
      return dbConfig.config as WebSearchToolConfig;
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
  } catch (error) {
    console.error('[Config Loader] Error loading web search config:', error);
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
      return dbConfig.config as OpenAIToolConfig;
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
  } catch (error) {
    console.error('[Config Loader] Error loading OpenAI config:', error);
    return null;
  }
}

