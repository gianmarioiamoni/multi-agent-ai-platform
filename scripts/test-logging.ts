/**
 * Test Structured Logging
 * Tests the structured logging system
 */

/* eslint-disable no-console */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createAdminClient } from '../src/lib/supabase/admin';
import { logInfo, logError, logWarn, createScopedLogger } from '../src/lib/logging/logger';
import { handleError, createUserFriendlyError } from '../src/lib/errors/error-handler';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Capture console errors/warnings from logger fallbacks
const capturedLoggerErrors: string[] = [];
const capturedLoggerWarns: string[] = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

// Intercept console to detect logger fallbacks
console.error = (...args: unknown[]) => {
  const message = args.map(arg => String(arg)).join(' ');
  if (message.includes('[Logger]')) {
    capturedLoggerErrors.push(message);
  }
  originalConsoleError(...args);
};

console.warn = (...args: unknown[]) => {
  const message = args.map(arg => String(arg)).join(' ');
  if (message.includes('[Logger]')) {
    capturedLoggerWarns.push(message);
  }
  originalConsoleWarn(...args);
};

async function testLogging() {
  console.log('🧪 Testing Structured Logging System\n');

  let hasErrors = false;
  const errors: string[] = [];

  try {
    // Verify environment variables first
    console.log('0️⃣ Verifying environment...');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
      hasErrors = true;
      errors.push('NEXT_PUBLIC_SUPABASE_URL is not configured');
    }
    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
      console.error('   → Logger will use console fallback (errors will be hidden)');
      hasErrors = true;
      errors.push('SUPABASE_SERVICE_ROLE_KEY is not configured');
    }
    if (supabaseUrl && supabaseServiceKey) {
      console.log('✅ Environment variables configured\n');
    } else {
      console.log('');
    }

    // Verify database connection
    console.log('1️⃣ Verifying database connection...');
    let supabase;
    try {
      supabase = await createAdminClient();
      
      // Test connection by checking if logs table exists
      const { error: tableError } = await supabase
        .from('logs')
        .select('id')
        .limit(1);
      
      if (tableError) {
        console.error('❌ Cannot access logs table:', tableError.message);
        console.error('   → Make sure migration 006 is applied!');
        console.error('   → Error details:', tableError.code || 'N/A');
        hasErrors = true;
        errors.push(`Database access error: ${tableError.message} (code: ${tableError.code || 'N/A'})`);
      } else {
        console.log('✅ Database connection verified');
        console.log('✅ Logs table exists and is accessible\n');
      }
    } catch (error) {
      console.error('❌ Failed to create admin client:', error instanceof Error ? error.message : String(error));
      hasErrors = true;
      errors.push(`Failed to create admin client: ${error instanceof Error ? error.message : String(error)}`);
      console.log('');
    }

    // Test 2: Basic logging
    console.log('2️⃣ Testing basic log functions...');
    try {
      await logInfo('system', 'Test info log', { test: true, timestamp: new Date().toISOString() });
      await logWarn('system', 'Test warning log', { test: true });
      await logError('system', 'Test error log', new Error('Test error message'), { test: true });
      console.log('✅ Basic logging test passed\n');
    } catch (error) {
      console.error('❌ Basic logging test failed:', error);
      hasErrors = true;
      errors.push(`Basic logging error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 3: Scoped logger
    console.log('3️⃣ Testing scoped logger...');
    try {
      const scopedLogger = createScopedLogger({
        category: 'agent.execution',
        agentId: 'test-agent-123',
        userId: 'test-user-456',
        requestId: 'test-req-789',
      });
      
      await scopedLogger.info('Agent execution started');
      await scopedLogger.warn('Rate limit approaching', { remaining: 2 });
      await scopedLogger.error('Agent execution failed', new Error('Test agent error'), {
        step: 'execution',
      });
      console.log('✅ Scoped logger test passed\n');
    } catch (error) {
      console.error('❌ Scoped logger test failed:', error);
      hasErrors = true;
      errors.push(`Scoped logger error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 4: Error handling with user-friendly messages
    console.log('4️⃣ Testing error handling...');
    
    const testErrors = [
      { error: new Error('Authentication required'), category: 'authentication' as const },
      { error: new Error('Agent not found'), category: 'not_found' as const },
      { error: new Error('Rate limit exceeded'), category: 'rate_limit' as const },
      { error: new Error('User message is required'), category: 'validation' as const },
      { error: new Error('Unknown error type'), category: 'unknown' as const },
    ];

    for (const { error, category } of testErrors) {
      const errorDetails = createUserFriendlyError(error, category);
      console.log(`   Error: "${error.message}"`);
      console.log(`   → User message: "${errorDetails.userMessage}"`);
      console.log(`   → Category: ${errorDetails.category}`);
      console.log('');
    }
    console.log('✅ Error handling test passed\n');

    // Test 5: Verify logs in database
    console.log('5️⃣ Verifying logs in database...');
    try {
      if (!supabase) {
        console.warn('⚠️  Skipping log verification (database connection failed)');
        hasErrors = true;
        errors.push('Cannot verify logs - database connection failed');
      } else {
        const { data: recentLogs, error: logsError } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (logsError) {
        console.error('❌ Error fetching logs:', logsError);
        console.error('   → Error details:', JSON.stringify(logsError, null, 2));
        hasErrors = true;
        errors.push(`Database query error: ${logsError.message}`);
        console.log('\n⚠️  Skipping log verification due to database error\n');
      } else if (!recentLogs || recentLogs.length === 0) {
        console.warn('⚠️  No logs found in database.');
        console.warn('   → Make sure migration 006 is applied!');
        console.warn('   → Check if logs are being written (they may use fallback to console)\n');
        hasErrors = true;
        errors.push('No logs found in database');
      } else {

        console.log(`✅ Found ${recentLogs.length} recent log entries:\n`);
        
        for (const log of recentLogs.slice(0, 5)) {
          console.log(`   [${log.level.toUpperCase()}] ${log.category}: ${log.message}`);
          if (log.context && Object.keys(log.context).length > 0) {
            console.log(`      Context:`, JSON.stringify(log.context, null, 2).split('\n').join('\n      '));
          }
          console.log('');
        }
      }
      }
    } catch (error) {
      console.error('❌ Error during log verification:', error);
      hasErrors = true;
      errors.push(`Log verification error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test 6: Test error handling with logging
    console.log('6️⃣ Testing error handling with logging...');
    try {
      throw new Error('Test error for handleError');
    } catch (error) {
      try {
        const userMessage = await handleError(error, 'agent_execution', {
          agentId: 'test-agent',
          test: true,
        });
        console.log(`   User message: "${userMessage}"`);
        console.log('✅ Error handling with logging test passed\n');
      } catch (handleError) {
        console.error('❌ Error handling test failed:', handleError);
        hasErrors = true;
        errors.push(`Error handling error: ${handleError instanceof Error ? handleError.message : String(handleError)}`);
      }
    }

    // Check for logger fallback errors
    if (capturedLoggerErrors.length > 0) {
      console.log('\n⚠️  Logger Fallback Errors Detected:\n');
      console.log('   The logger is falling back to console logging because database writes are failing.');
      console.log('   This means logs are NOT being saved to the database.\n');
      capturedLoggerErrors.forEach((err, index) => {
        console.log(`   ${index + 1}. ${err}`);
      });
      hasErrors = true;
      errors.push(`${capturedLoggerErrors.length} logger fallback error(s) detected`);
      console.log('\n💡 This usually means:');
      console.log('   - Migration 006 may not be applied');
      console.log('   - SUPABASE_SERVICE_ROLE_KEY may be incorrect');
      console.log('   - RLS policies may be blocking inserts');
      console.log('   - Database connection issues\n');
    }

    if (capturedLoggerWarns.length > 0) {
      console.log('\n⚠️  Logger Warnings:\n');
      capturedLoggerWarns.forEach((warn, index) => {
        console.log(`   ${index + 1}. ${warn}`);
      });
      console.log('');
    }

    // Summary
    if (hasErrors) {
      console.log('⚠️  Test completed with errors:\n');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
      console.log('\n💡 Recommendations:');
      console.log('   - Run: pnpm test:logging:detailed (for more details)');
      console.log('   - Verify migration 006 is applied');
      console.log('   - Check SUPABASE_SERVICE_ROLE_KEY configuration');
      console.log('   - Verify database connection\n');
      process.exit(1);
    } else {
      console.log('🎉 All logging tests passed!\n');
      console.log('✅ Logs are being written to database correctly');
      console.log('✅ No fallback errors detected\n');
    }
    
  } catch (error) {
    console.error('\n❌ Test suite failed with unexpected error:', error);
    console.error('   Stack:', error instanceof Error ? error.stack : 'N/A');
    process.exit(1);
  } finally {
    // Restore original console methods
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
  }
}

// Run tests
testLogging()
  .then(() => {
    console.log('\n✅ Test suite completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed with exception:', error);
    console.error('   Message:', error instanceof Error ? error.message : String(error));
    console.error('   Stack:', error instanceof Error ? error.stack : 'N/A');
    process.exit(1);
  });

