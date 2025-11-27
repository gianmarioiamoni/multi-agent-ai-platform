/**
 * Contact Form Server Actions
 * Handles contact form submission and email sending
 * Following SRP: Only handles server-side contact form logic
 */

'use server';

import { emailTool } from '@/lib/tools/email';
import { getEmailToolConfig } from '@/lib/tools/config-loader';
import { logInfo, logError } from '@/lib/logging/logger';
import type { ContactFormData } from '@/types/contact.types';
import { CONTACT_RESPONSE_DAYS } from './constants';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/**
 * Send contact form email to admin
 */
async function sendAdminEmail(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  if (!ADMIN_EMAIL) {
    logError('Contact form: ADMIN_EMAIL environment variable not set');
    return {
      success: false,
      error: 'Contact form is not configured. Please contact support directly.',
    };
  }

  // Get email config to check if email is enabled
  const emailConfig = await getEmailToolConfig();
  if (!emailConfig || !emailConfig.enabled) {
    logError('Contact form: Email service is not configured');
    return {
      success: false,
      error: 'Email service is not configured. Please contact support directly.',
    };
  }

  // Format category label
  const categoryLabels: Record<string, string> = {
    technical: 'Technical Support',
    commercial: 'Commercial Inquiry',
    feature: 'Feature Request',
    bug: 'Bug Report',
    partnership: 'Partnership',
    general: 'General Inquiry',
  };

  const categoryLabel = categoryLabels[formData.category] || formData.category;

  // Create email subject
  const subject = `[Contact Form] ${categoryLabel}: ${formData.subject}`;

  // Create email body (HTML)
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #4f46e5; }
        .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; }
        .message { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Category:</div>
            <div class="value">${categoryLabel}</div>
          </div>
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${formData.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
          </div>
          <div class="field">
            <div class="label">Subject:</div>
            <div class="value">${formData.subject}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value message">${formData.message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email to admin
  const result = await emailTool.execute({
    to: ADMIN_EMAIL,
    subject,
    body: htmlBody,
    html: true,
  });

  if (!result.success) {
    logError('Contact form: Failed to send admin email', { error: result.error });
    return {
      success: false,
      error: result.error || 'Failed to send contact form. Please try again later.',
    };
  }

  logInfo('Contact form: Admin email sent successfully', {
    category: formData.category,
    email: formData.email,
  });

  return { success: true };
}

/**
 * Send confirmation email to user
 */
async function sendConfirmationEmail(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  // Get email config to check if email is enabled
  const emailConfig = await getEmailToolConfig();
  if (!emailConfig || !emailConfig.enabled) {
    // If email is not configured, don't fail the form submission
    // Just log a warning
    logError('Contact form: Email service not configured, skipping confirmation email');
    return { success: true }; // Don't fail the submission
  }

  const subject = 'Thank you for contacting us - We\'ll respond within ' + CONTACT_RESPONSE_DAYS + ' business days';

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .message { background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank you for contacting us!</h2>
        </div>
        <div class="content">
          <p>Dear ${formData.name},</p>
          <div class="message">
            <p>We have received your message and want to thank you for reaching out to us.</p>
            <p><strong>Your inquiry:</strong> ${formData.subject}</p>
            <p>Our team will review your message and get back to you within <strong>${CONTACT_RESPONSE_DAYS} business days</strong>.</p>
          </div>
          <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
          <div class="footer">
            <p>Best regards,<br>The Multi-Agent AI Platform Team</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const result = await emailTool.execute({
    to: formData.email,
    subject,
    body: htmlBody,
    html: true,
  });

  if (!result.success) {
    // Log error but don't fail the form submission
    logError('Contact form: Failed to send confirmation email', { error: result.error });
    return { success: true }; // Don't fail the submission if confirmation fails
  }

  logInfo('Contact form: Confirmation email sent successfully', {
    email: formData.email,
  });

  return { success: true };
}

/**
 * Submit contact form
 * Sends email to admin and confirmation email to user
 */
export async function submitContactForm(
  formData: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Send email to admin (required)
    const adminResult = await sendAdminEmail(formData);
    if (!adminResult.success) {
      return adminResult;
    }

    // Send confirmation email to user (optional, don't fail if it fails)
    await sendConfirmationEmail(formData);

    return { success: true };
  } catch (error) {
    logError('Contact form: Unexpected error', { error: error instanceof Error ? error.message : String(error) });
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}

