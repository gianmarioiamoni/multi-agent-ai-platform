/**
 * Test Email Tool
 * Script to test email sending functionality
 */

import { config } from 'dotenv';
import { executeTool, isToolAvailable } from '@/lib/tools/registry';

// Load environment variables
config({ path: '.env.local' });

async function testEmailTool() {
  console.log('📧 Testing Email Tool...\n');

  // Check availability
  console.log('1. Checking Email Tool Availability');
  const isAvailable = isToolAvailable('email');
  console.log(`   Result: ${isAvailable ? '✅ Available' : '❌ Not configured'}\n`);

  if (!isAvailable) {
    console.log('❌ Email tool is not configured.');
    console.log('   Please set the following environment variables:');
    console.log('   - SMTP_HOST');
    console.log('   - SMTP_PORT');
    console.log('   - SMTP_USER');
    console.log('   - SMTP_PASSWORD');
    console.log('   - SMTP_FROM_EMAIL (optional)\n');
    console.log('   See docs/EMAIL_SETUP.md for setup instructions.\n');
    process.exit(1);
  }

  // Get test recipient from env or use placeholder
  const testRecipient = process.env.TEST_EMAIL_RECIPIENT || 'test@example.com';
  
  console.log('2. Sending Test Email');
  console.log(`   To: ${testRecipient}`);
  console.log('   Subject: Test Email from Multi-Agent AI Platform');
  console.log('   Body: This is a test email...\n');

  // Execute email tool
  const result = await executeTool('email', {
    to: testRecipient,
    subject: 'Test Email from Multi-Agent AI Platform',
    body: 'This is a test email from the Multi-Agent AI Platform Email Tool.\n\nIf you received this email, the configuration is correct!',
    html: false,
  });

  console.log('3. Email Tool Result:');
  console.log('   ', JSON.stringify(result, null, 2), '\n');

  if (result.success) {
    console.log('✅ Email sent successfully!');
    const emailData = result.data as { messageId?: string; timestamp?: string } | undefined;
    if (emailData?.messageId) {
      console.log(`   Message ID: ${emailData.messageId}`);
    }
    if (emailData?.timestamp) {
      console.log(`   Timestamp: ${emailData.timestamp}`);
    }
    console.log(`   Execution Time: ${result.executionTime}ms\n`);
  } else {
    console.log('❌ Email sending failed!');
    console.log(`   Error: ${result.error}\n`);
    process.exit(1);
  }

  console.log('🎉 Email tool test completed!\n');
}

// Run test
testEmailTool().catch((error) => {
  console.error('❌ Test failed with error:', error);
  process.exit(1);
});

