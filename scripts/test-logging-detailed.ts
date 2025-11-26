/**
 * Detailed Test for Structured Logging
 * Tests with explicit error checking and verification
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createAdminClient } from '../src/lib/supabase/admin';
import { logInfo, logError, logWarn, createScopedLogger } from '../src/lib/logging/logger';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Capture console errors/warnings to check for logger fallbacks
const capturedConsoleErrors: string[] = [];
const capturedConsoleWarns: string[] = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: unknown[]) => {
  const message = args.map(arg => String(arg)).join(' ');
  if (message.includes('[Logger]')) {
    capturedConsoleErrors.push(message);
  }
  originalConsoleError(...args);
};

console.warn = (...args: unknown[]) => {
  const message = args.map(arg => String(arg)).join(' ');
  if (message.includes('[Logger]')) {
    capturedConsoleWarns.push(message);
  }
  originalConsoleWarn(...args);
};

async function testLoggingDetailed() {
  console.log('🔍 Detailed Test for Structured Logging System\n');
  console.log('This test checks for silent errors and fallback behavior\n');

  let hasIssues = false;

  try {
    // Step 1: Verify environment
    console.log('📋 Step 1: Verifying environment...');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
      hasIssues = true;
    } else {
      console.log('✅ NEXT_PUBLIC_SUPABASE_URL is configured');
    }

    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
      console.error('   → Logger will fallback to console logging');
      hasIssues = true;
    } else {
      console.log('✅ SUPABASE_SERVICE_ROLE_KEY is configured');
    }
    console.log('');

    // Step 2: Test database connection
    console.log('📋 Step 2: Testing database connection...');
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from('logs')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('   → Error code:', error.code);
        console.error('   → Error details:', error.details);
        console.error('   → Make sure migration 006 is applied!');
        hasIssues = true;
      } else {
        console.log('✅ Database connection successful');
        console.log('✅ Logs table exists and is accessible');
      }
      console.log('');
    } catch (error) {
      console.error('❌ Exception connecting to database:', error instanceof Error ? error.message : String(error));
      hasIssues = true;
      console.log('');
    }

    // Step 3: Test log writing
    console.log('📋 Step 3: Testing log writing...');
    const testLogId = `test-${Date.now()}`;
    
    try {
      await logInfo('system', `Test log write ${testLogId}`, { testId: testLogId });
      
      // Wait a bit for async write
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check for console fallback
      if (capturedConsoleErrors.length > 0) {
        console.error('❌ Logger errors detected (using fallback):');
        capturedConsoleErrors.forEach(err => {
          console.error(`   - ${err}`);
        });
        hasIssues = true;
      } else {
        console.log('✅ No logger errors detected');
      }
      console.log('');
    } catch (error) {
      console.error('❌ Exception during log write:', error instanceof Error ? error.message : String(error));
      hasIssues = true;
      console.log('');
    }

    // Step 4: Verify log was actually written
    console.log('📋 Step 4: Verifying log was written to database...');
    try {
      const supabase = await createAdminClient();
      const { data: logs, error: queryError } = await supabase
        .from('logs')
        .select('*')
        .eq('message', `Test log write ${testLogId}`)
        .limit(1);

      if (queryError) {
        console.error('❌ Error querying logs:', queryError.message);
        hasIssues = true;
      } else if (!logs || logs.length === 0) {
        console.warn('⚠️  Test log not found in database');
        console.warn('   → Log may have been written to console only (fallback mode)');
        console.warn('   → Check for "[Logger] Failed to write log" messages above');
        hasIssues = true;
      } else {
        console.log('✅ Test log found in database');
        console.log(`   Log ID: ${logs[0].id}`);
        console.log(`   Level: ${logs[0].level}`);
        console.log(`   Category: ${logs[0].category}`);
      }
      console.log('');
    } catch (error) {
      console.error('❌ Exception verifying log:', error instanceof Error ? error.message : String(error));
      hasIssues = true;
      console.log('');
    }

    // Summary
    console.log('📊 Summary:\n');
    
    if (capturedConsoleErrors.length > 0) {
      console.log('⚠️  Logger fallback errors detected:');
      capturedConsoleErrors.forEach((err, index) => {
        console.log(`   ${index + 1}. ${err}`);
      });
      console.log('');
    }

    if (capturedConsoleWarns.length > 0) {
      console.log('⚠️  Logger warnings detected:');
      capturedConsoleWarns.forEach((warn, index) => {
        console.log(`   ${index + 1}. ${warn}`);
      });
      console.log('');
    }

    if (hasIssues) {
      console.log('❌ Test completed with issues detected');
      console.log('\n💡 Recommendations:');
      console.log('   1. Verify SUPABASE_SERVICE_ROLE_KEY is set correctly');
      console.log('   2. Ensure migration 006 is applied');
      console.log('   3. Check database connection in Supabase dashboard');
      console.log('   4. Verify RLS policies allow service role inserts');
      console.log('');
      process.exit(1);
    } else {
      console.log('✅ All tests passed! Logging is working correctly.');
      console.log('');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    console.error('   Stack:', error instanceof Error ? error.stack : 'N/A');
    process.exit(1);
  } finally {
    // Restore original console methods
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }
}

testLoggingDetailed();

