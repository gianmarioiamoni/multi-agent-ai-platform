/**
 * Check Email Configuration
 * Verifies if email service is properly configured
 */

import 'dotenv/config';

async function checkEmailConfig() {
  console.log('📧 Checking Email Configuration...\n');

  // Check for Gmail configuration (simplest)
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const hasGmail = !!(gmailUser && gmailAppPassword);

  // Check for generic SMTP configuration
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM_EMAIL;
  const hasGenericSMTP = !!(smtpHost && smtpPort && smtpUser && smtpPass);

  // Check admin email
  const adminEmail = process.env.ADMIN_EMAIL;

  console.log('📨 Configuration Options:');
  console.log('\n1️⃣  Gmail SMTP (Recommended - Simplest):');
  console.log(`  GMAIL_USER: ${gmailUser ? `✓ Set (${gmailUser})` : '✗ Missing'}`);
  console.log(`  GMAIL_APP_PASSWORD: ${gmailAppPassword ? '✓ Set' : '✗ Missing'}`);

  console.log('\n2️⃣  Generic SMTP:');
  console.log(`  SMTP_HOST: ${smtpHost ? `✓ Set (${smtpHost})` : '✗ Missing'}`);
  console.log(`  SMTP_PORT: ${smtpPort ? `✓ Set (${smtpPort})` : '✗ Missing'}`);
  console.log(`  SMTP_USER: ${smtpUser ? `✓ Set (${smtpUser})` : '✗ Missing'}`);
  console.log(`  SMTP_PASSWORD: ${smtpPass ? '✓ Set' : '✗ Missing'}`);
  console.log(`  SMTP_FROM_EMAIL: ${smtpFrom ? `✓ Set (${smtpFrom})` : '⚠️  Missing (will use SMTP_USER)'}`);

  console.log('\n📧 Required:');
  console.log(`  ADMIN_EMAIL: ${adminEmail ? `✓ Set (${adminEmail})` : '✗ Missing'}`);

  const isConfigured = (hasGmail || hasGenericSMTP) && adminEmail;
  
  console.log('\n📋 Status:');
  if (isConfigured) {
    console.log('  ✅ Email configuration is complete!');
    if (hasGmail) {
      console.log('  📧 Using Gmail SMTP (smtp.gmail.com:587)');
    } else if (hasGenericSMTP) {
      console.log(`  📧 Using Generic SMTP (${smtpHost}:${smtpPort})`);
    }
    console.log('  The contact form should work correctly.');
  } else {
    console.log('  ❌ Email configuration is incomplete.');
    console.log('\n⚠️  Missing required configuration:');
    
    if (!hasGmail && !hasGenericSMTP) {
      console.log('\n  Choose ONE of these options:');
      console.log('\n  Option A - Gmail (Simplest):');
      console.log('    - GMAIL_USER');
      console.log('    - GMAIL_APP_PASSWORD (Get it from: https://support.google.com/accounts/answer/185833)');
      console.log('\n  Option B - Generic SMTP:');
      console.log('    - SMTP_HOST');
      console.log('    - SMTP_PORT');
      console.log('    - SMTP_USER');
      console.log('    - SMTP_PASSWORD');
    }
    
    if (!adminEmail) {
      console.log('\n  Required:');
      console.log('    - ADMIN_EMAIL');
    }
    
    console.log('\n💡 To fix:');
    console.log('  1. Add the missing variables to .env.local');
    console.log('  2. Or configure email via Admin Settings page');
    console.log('  3. Restart the development server after adding variables');
    console.log('\n📖 Gmail App Password Guide:');
    console.log('   https://support.google.com/accounts/answer/185833');
  }

  console.log('\n📝 Notes:');
  console.log('  - Gmail config takes priority if both Gmail and Generic SMTP are set');
  console.log('  - Configuration can be set via environment variables OR Admin Settings');
  console.log('  - Environment variables take precedence if both are set');
}

checkEmailConfig().catch(console.error);

