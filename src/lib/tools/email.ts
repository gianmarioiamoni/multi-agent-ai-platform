/**
 * Email Tool
 * Implements email sending functionality using Nodemailer (SMTP)
 * Following SRP: Only handles email sending logic
 */

import nodemailer, { type Transporter } from 'nodemailer';
import { getEmailToolConfig } from '@/lib/tools/config-loader';
import type {
  Tool,
  EmailParams,
  EmailData,
  ToolResult,
} from '@/types/tool.types';
import type { EmailToolConfig } from '@/types/tool-config.types';

// Email tool configuration
const EMAIL_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 2;

/**
 * Create and configure Nodemailer transporter from config
 */
async function createTransporter(): Promise<Transporter | null> {
  // Get configuration from database (with env fallback)
  const config = await getEmailToolConfig();
  
  if (!config || !config.enabled) {
    console.error('[Email Tool] Email configuration not found or disabled');
    return null;
  }

  // Handle SMTP provider
  if (config.provider === 'smtp') {
    const smtpHost = config.smtp_host;
    const smtpPort = config.smtp_port;
    const smtpUser = config.smtp_user;
    const smtpPass = config.smtp_password;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('[Email Tool] SMTP configuration incomplete:', {
        hasHost: !!smtpHost,
        hasPort: !!smtpPort,
        hasUser: !!smtpUser,
        hasPass: !!smtpPass,
      });
      return null;
    }

    // Parse port as number if it's not already
    const port = typeof smtpPort === 'number' ? smtpPort : parseInt(String(smtpPort), 10);
    if (isNaN(port)) {
      console.error('[Email Tool] Invalid SMTP_PORT:', smtpPort);
      return null;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // Connection timeout
      connectionTimeout: EMAIL_TIMEOUT,
      // Socket timeout
      socketTimeout: EMAIL_TIMEOUT,
    });

    return transporter;
  }

  // For now, only SMTP is supported
  // TODO: Implement Resend, SendGrid, Mailgun providers
  console.error('[Email Tool] Provider not yet supported:', config.provider);
  return null;
}

/**
 * Get sender email from config
 */
async function getSenderEmail(config: EmailToolConfig | null): Promise<string | null> {
  if (!config) {
    const emailConfig = await getEmailToolConfig();
    if (!emailConfig) return null;
    config = emailConfig;
  }

  if (config.provider === 'smtp') {
    return config.smtp_from_email || config.smtp_user || null;
  }

  return config.from_email || null;
}

/**
 * Execute email sending using Nodemailer
 */
async function executeSendEmail(
  params: EmailParams
): Promise<ToolResult<EmailData>> {
  const startTime = Date.now();

  try {
    // Validate params
    if (!params.to || params.to.trim().length === 0) {
      return {
        success: false,
        error: 'Email recipient (to) is required',
        executionTime: Date.now() - startTime,
      };
    }

    if (!params.subject || params.subject.trim().length === 0) {
      return {
        success: false,
        error: 'Email subject is required',
        executionTime: Date.now() - startTime,
      };
    }

    if (!params.body || params.body.trim().length === 0) {
      return {
        success: false,
        error: 'Email body is required',
        executionTime: Date.now() - startTime,
      };
    }

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.to)) {
      return {
        success: false,
        error: 'Invalid email address format',
        executionTime: Date.now() - startTime,
      };
    }

    // Get configuration and transporter
    const config = await getEmailToolConfig();
    if (!config || !config.enabled) {
      return {
        success: false,
        error: 'Email service is not configured. Please contact administrator.',
        executionTime: Date.now() - startTime,
      };
    }

    const transporter = await createTransporter();
    if (!transporter) {
      console.error('[Email Tool] Failed to create transporter');
      return {
        success: false,
        error: 'Email service is not configured. Please contact administrator.',
        executionTime: Date.now() - startTime,
      };
    }

    // Get sender email from config
    const smtpFrom = await getSenderEmail(config);
    if (!smtpFrom) {
      return {
        success: false,
        error: 'Email sender address is not configured',
        executionTime: Date.now() - startTime,
      };
    }

    // Determine content type
    const isHtml = params.html ?? false;

    console.log('[Email Tool] Sending email:', {
      to: params.to,
      subject: params.subject,
      from: smtpFrom,
      isHtml,
      bodyLength: params.body.length,
    });

    // Send email with timeout
    const mailOptions = {
      from: smtpFrom,
      to: params.to,
      subject: params.subject,
      text: isHtml ? undefined : params.body,
      html: isHtml ? params.body : undefined,
    };

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Email sending timed out'));
      }, EMAIL_TIMEOUT);
    });

    // Send email with timeout
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      timeoutPromise,
    ]);

    const executionTime = Date.now() - startTime;

    console.log('[Email Tool] Email sent successfully:', {
      to: params.to,
      messageId: info.messageId,
      executionTime,
    });

    return {
      success: true,
      data: {
        messageId: info.messageId || 'unknown',
        timestamp: new Date().toISOString(),
      },
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;

    // Handle timeout
    if (error instanceof Error && error.message.includes('timed out')) {
      console.error('[Email Tool] Timeout:', {
        to: params.to,
        timeout: EMAIL_TIMEOUT,
      });
      return {
        success: false,
        error: 'Email sending timed out',
        executionTime,
      };
    }

    // Handle SMTP errors
    if (error instanceof Error && 'code' in error) {
      console.error('[Email Tool] SMTP error:', {
        code: (error as { code?: string }).code,
        message: error.message,
      });
      
      let errorMessage = 'Failed to send email';
      
      // Provide user-friendly error messages
      if (error.message.includes('authentication failed')) {
        errorMessage = 'SMTP authentication failed. Please check credentials.';
      } else if (error.message.includes('connection')) {
        errorMessage = 'Failed to connect to SMTP server. Please check configuration.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'SMTP server timeout. Please try again later.';
      }

      return {
        success: false,
        error: errorMessage,
        executionTime,
      };
    }

    // Handle other errors
    console.error('[Email Tool] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      executionTime,
    };
  }
}

/**
 * Email tool with retry logic
 */
async function executeWithRetry(
  params: EmailParams,
  retriesLeft: number = MAX_RETRIES
): Promise<ToolResult<EmailData>> {
  const result = await executeSendEmail(params);

  // Retry on failure (except for validation errors)
  if (
    !result.success &&
    retriesLeft > 0 &&
    !result.error?.includes('required') &&
    !result.error?.includes('not configured') &&
    !result.error?.includes('Invalid email')
  ) {
    console.log(`[Email Tool] Retrying... (${retriesLeft} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
    return executeWithRetry(params, retriesLeft - 1);
  }

  return result;
}

/**
 * Email Tool Definition
 */
export const emailTool: Tool<EmailParams, EmailData> = {
  id: 'email',
  name: 'Send Email',
  description:
    'Send an email to a recipient. Supports plain text and HTML content. Requires SMTP server configuration.',
  
  // JSON schema for OpenAI function calling
  paramsSchema: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        description: 'Recipient email address',
      },
      subject: {
        type: 'string',
        description: 'Email subject line',
      },
      body: {
        type: 'string',
        description: 'Email body content (plain text or HTML)',
      },
      html: {
        type: 'boolean',
        description: 'Whether the body contains HTML content (default: false)',
        default: false,
      },
    },
    required: ['to', 'subject', 'body'],
  },
  
  execute: executeWithRetry,
};

