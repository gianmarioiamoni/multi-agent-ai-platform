# Email Tool Setup Guide

This guide explains how to configure the Email Tool using Nodemailer with SMTP.

## Overview

The Email Tool uses **Nodemailer** to send emails via SMTP. This supports any SMTP provider, including:
- Gmail (with App Password)
- Outlook/Office365
- Custom SMTP servers
- Other email services (SendGrid, Mailgun, etc.)

## Environment Variables

Add the following variables to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com  # Optional: defaults to SMTP_USER
```

## Configuration Examples

### Gmail Setup

1. **Enable 2-Factor Authentication** on your Google account
2. **Create an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Configure `.env.local`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # Your app password (16 chars)
   SMTP_FROM_EMAIL=your-email@gmail.com
   ```

**Note**: For Gmail, use port `587` (STARTTLS) or `465` (SSL). The tool automatically detects SSL based on port.

### Outlook/Office365 Setup

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=your-email@outlook.com
```

### Custom SMTP Server

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASSWORD=password
SMTP_FROM_EMAIL=noreply@example.com
```

## Security Considerations

### ⚠️ Important Notes

1. **Never commit `.env.local`** to version control
2. **Use App Passwords** for Gmail instead of your main password
3. **Restrict SMTP credentials** to admin users only (handled by RLS policies)
4. **Rotate credentials** periodically

### Admin-Only Configuration

The SMTP configuration should be managed by administrators only:
- Configuration is stored in environment variables (server-side only)
- Regular users cannot access or modify SMTP settings
- The tool checks for configuration before allowing email sending

## Testing the Email Tool

### Using the Test Script

Create a test script to verify email configuration:

```typescript
// scripts/test-email.ts
import { config } from 'dotenv';
import { executeTool } from '@/lib/tools/registry';

config({ path: '.env.local' });

async function testEmail() {
  const result = await executeTool('email', {
    to: 'test@example.com',
    subject: 'Test Email',
    body: 'This is a test email from the Multi-Agent AI Platform.',
    html: false,
  });

  console.log('Email Result:', result);
}

testEmail();
```

Run with:
```bash
pnpm tsx scripts/test-email.ts
```

### Manual Testing

1. Ensure all SMTP environment variables are set
2. The tool will log configuration status on startup
3. Check server logs for email sending status

## Troubleshooting

### Common Issues

#### "SMTP authentication failed"
- **Gmail**: Make sure you're using an App Password, not your regular password
- **Outlook**: Verify credentials and 2FA settings
- **Custom SMTP**: Check username/password are correct

#### "Connection timeout"
- Check `SMTP_HOST` and `SMTP_PORT` are correct
- Verify firewall/network allows SMTP connections
- Try port `465` (SSL) instead of `587` (STARTTLS)

#### "Email service is not configured"
- Verify all required environment variables are set:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASSWORD`

#### "Invalid email address format"
- Ensure recipient email is in valid format: `user@domain.com`
- Check for typos in email addresses

### Debugging

Enable detailed logging:
- Email tool logs all operations to console
- Check server logs for detailed error messages
- Verify environment variables are loaded correctly

## Email Tool Features

- ✅ **Plain text emails**: Default content type
- ✅ **HTML emails**: Set `html: true` in params
- ✅ **Timeout protection**: 15-second timeout per email
- ✅ **Retry logic**: Automatic retry on transient failures (2 attempts)
- ✅ **Input validation**: Email format, required fields
- ✅ **Error handling**: User-friendly error messages

## Integration with Agents

The Email Tool is available in the Agent Builder:
1. Select "email" in the tools checkbox
2. Agents can use `sendEmail` function calling
3. OpenAI will automatically choose to use email tool when appropriate

## Next Steps

After configuring SMTP:
1. Test email sending with the test script
2. Create an agent with email tool enabled
3. Test agent email functionality
4. Set up LLM function calling (Sprint 2, Week 4)

---

**Related Documentation**:
- [Tool Registry](./TOOLS_SETUP.md)
- [Agent Builder](../src/components/agents/agent-builder.tsx)
- [OpenAI Function Calling](./OPENAI_FUNCTION_CALLING.md) (coming soon)

