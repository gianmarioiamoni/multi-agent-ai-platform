/**
 * Subscription Email Notifications
 * Send email notifications for subscription events
 * Following SRP: Only handles email notification logic
 */

import nodemailer, { type Transporter } from 'nodemailer';
import { getEmailToolConfig } from '@/lib/tools/config-loader';
import { logInfo, logError } from '@/lib/logging/logger';
import type { EmailToolConfig } from '@/types/tool-config.types';

let cachedTransporter: Transporter | null = null;

/**
 * Get or create Nodemailer transporter
 */
async function getTransporter(): Promise<Transporter | null> {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const config = await getEmailToolConfig();
  
  if (!config || !config.enabled || config.provider !== 'smtp') {
    logError(
      'subscription',
      'Email configuration not available for subscription notifications',
      new Error('Email config missing or disabled'),
      {
        hasConfig: !!config,
        enabled: config?.enabled,
        provider: config?.provider,
      }
    );
    return null;
  }

  const smtpHost = config.smtp_host;
  const smtpPort = config.smtp_port;
  const smtpUser = config.smtp_user;
  const smtpPass = config.smtp_password;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    logError(
      'subscription',
      'SMTP configuration incomplete for subscription notifications',
      new Error('SMTP config incomplete')
    );
    return null;
  }

  const port = typeof smtpPort === 'number' ? smtpPort : parseInt(String(smtpPort), 10);
  if (isNaN(port)) {
    logError(
      'subscription',
      'Invalid SMTP_PORT for subscription notifications',
      new Error(`Invalid port: ${smtpPort}`),
      { port: smtpPort }
    );
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: smtpHost,
    port: port,
    secure: port === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 15000,
    socketTimeout: 15000,
  });

  return cachedTransporter;
}

/**
 * Get sender email from config
 */
async function getSenderEmail(): Promise<string> {
  const config = await getEmailToolConfig();
  if (config?.provider === 'smtp') {
    return config.smtp_from_email || config.smtp_user || process.env.ADMIN_EMAIL || 'noreply@multiagent.ai';
  }
  return config?.from_email || process.env.ADMIN_EMAIL || 'noreply@multiagent.ai';
}

/**
 * Send subscription expiry warning (2 days before)
 */
export async function sendSubscriptionExpiringSoonEmail(
  userEmail: string,
  userName: string | null,
  planName: string,
  expiresAt: string
): Promise<boolean> {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      logError(
        'subscription',
        'Cannot send subscription expiry warning: transporter not available',
        new Error('Transporter not available')
      );
      return false;
    }

    const fromEmail = await getSenderEmail();
    const expiryDate = new Date(expiresAt).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Your Subscription Expires Soon</h1>
            </div>
            <div class="content">
              <p>Hello ${userName || 'User'},</p>
              <p>Your <strong>${planName}</strong> subscription will expire in <strong>2 days</strong> (on ${expiryDate}).</p>
              <p>To continue using Multi-Agent AI Platform without interruption, please subscribe to a paid plan:</p>
              <ul>
                <li><strong>Basic Plan:</strong> €9.90/month or €99/year</li>
                <li><strong>Premium Plan:</strong> €19.90/month or €199/year</li>
              </ul>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/pricing" class="button">
                  View Plans & Subscribe
                </a>
              </p>
              <p>If your subscription expires, your account will be disabled and you will lose access to all features.</p>
            </div>
            <div class="footer">
              <p>Multi-Agent AI Platform</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Hello ${userName || 'User'},

Your ${planName} subscription will expire in 2 days (on ${expiryDate}).

To continue using Multi-Agent AI Platform without interruption, please subscribe to a paid plan:
- Basic Plan: €9.90/month or €99/year
- Premium Plan: €19.90/month or €199/year

Visit ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/pricing to view plans and subscribe.

If your subscription expires, your account will be disabled and you will lose access to all features.

Multi-Agent AI Platform
This is an automated notification.
    `;

    await transporter.sendMail({
      from: `"Multi-Agent AI Platform" <${fromEmail}>`,
      to: userEmail,
      subject: `⚠️ Your Subscription Expires in 2 Days`,
      text: textContent,
      html: htmlContent,
    });

    logInfo('subscription', 'Subscription expiry warning email sent', {
      userEmail,
      planName,
      expiresAt,
    });

    return true;
  } catch (error) {
    logError(
      'subscription',
      'Failed to send subscription expiry warning email',
      error instanceof Error ? error : new Error(String(error)),
      {
        userEmail,
      }
    );
    return false;
  }
}

/**
 * Send subscription expired email
 */
export async function sendSubscriptionExpiredEmail(
  userEmail: string,
  userName: string | null,
  planName: string
): Promise<boolean> {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      logError(
        'subscription',
        'Cannot send subscription expired email: transporter not available',
        new Error('Transporter not available')
      );
      return false;
    }

    const fromEmail = await getSenderEmail();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔴 Your Subscription Has Expired</h1>
            </div>
            <div class="content">
              <p>Hello ${userName || 'User'},</p>
              <p>Your <strong>${planName}</strong> subscription has expired.</p>
              <p>Your account will be disabled shortly. To regain access and continue using Multi-Agent AI Platform, please subscribe to a paid plan:</p>
              <ul>
                <li><strong>Basic Plan:</strong> €9.90/month or €99/year</li>
                <li><strong>Premium Plan:</strong> €19.90/month or €199/year</li>
              </ul>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/pricing" class="button">
                  Subscribe Now
                </a>
              </p>
              <p>Once you subscribe, your account will be reactivated immediately and you'll regain full access to all features.</p>
            </div>
            <div class="footer">
              <p>Multi-Agent AI Platform</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Hello ${userName || 'User'},

Your ${planName} subscription has expired.

Your account will be disabled shortly. To regain access and continue using Multi-Agent AI Platform, please subscribe to a paid plan:
- Basic Plan: €9.90/month or €99/year
- Premium Plan: €19.90/month or €199/year

Visit ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/pricing to subscribe.

Once you subscribe, your account will be reactivated immediately.

Multi-Agent AI Platform
This is an automated notification.
    `;

    await transporter.sendMail({
      from: `"Multi-Agent AI Platform" <${fromEmail}>`,
      to: userEmail,
      subject: `🔴 Your Subscription Has Expired`,
      text: textContent,
      html: htmlContent,
    });

    logInfo('subscription', 'Subscription expired email sent', {
      userEmail,
      planName,
    });

    return true;
  } catch (error) {
    logError(
      'subscription',
      'Failed to send subscription expired email',
      error instanceof Error ? error : new Error(String(error)),
      {
        userEmail,
      }
    );
    return false;
  }
}

/**
 * Send account disabled email
 */
export async function sendAccountDisabledEmail(
  userEmail: string,
  userName: string | null
): Promise<boolean> {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      logError(
        'subscription',
        'Cannot send account disabled email: transporter not available',
        new Error('Transporter not available')
      );
      return false;
    }

    const fromEmail = await getSenderEmail();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚫 Your Account Has Been Disabled</h1>
            </div>
            <div class="content">
              <p>Hello ${userName || 'User'},</p>
              <p>Your account has been disabled because your subscription has expired.</p>
              <p>You no longer have access to Multi-Agent AI Platform.</p>
              <p>To reactivate your account and continue using the platform, please subscribe to a paid plan:</p>
              <ul>
                <li><strong>Basic Plan:</strong> €9.90/month or €99/year</li>
                <li><strong>Premium Plan:</strong> €19.90/month or €199/year</li>
              </ul>
              <p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/pricing" class="button">
                  Subscribe & Reactivate Account
                </a>
              </p>
              <p>Once you subscribe, your account will be reactivated immediately and you'll regain full access to all your agents, workflows, and data.</p>
            </div>
            <div class="footer">
              <p>Multi-Agent AI Platform</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Hello ${userName || 'User'},

Your account has been disabled because your subscription has expired.

You no longer have access to Multi-Agent AI Platform.

To reactivate your account and continue using the platform, please subscribe to a paid plan:
- Basic Plan: €9.90/month or €99/year
- Premium Plan: €19.90/month or €199/year

Visit ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/pricing to subscribe.

Once you subscribe, your account will be reactivated immediately and you'll regain full access to all your agents, workflows, and data.

Multi-Agent AI Platform
This is an automated notification.
    `;

    await transporter.sendMail({
      from: `"Multi-Agent AI Platform" <${fromEmail}>`,
      to: userEmail,
      subject: `🚫 Your Account Has Been Disabled`,
      text: textContent,
      html: htmlContent,
    });

    logInfo('subscription', 'Account disabled email sent', {
      userEmail,
    });

    return true;
  } catch (error) {
    logError(
      'subscription',
      'Failed to send account disabled email',
      error instanceof Error ? error : new Error(String(error)),
      {
        userEmail,
      }
    );
    return false;
  }
}

