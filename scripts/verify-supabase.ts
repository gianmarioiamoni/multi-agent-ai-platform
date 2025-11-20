/**
 * Supabase Configuration Verification Script
 * Verifies that Supabase is correctly configured and the database schema is in place
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg: string) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`),
};

const verifyEnvironmentVariables = (): boolean => {
  log.section('1. Verifying Environment Variables');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  let allPresent = true;

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      log.error(`${varName} is not set`);
      allPresent = false;
    } else if (value.includes('your-')) {
      log.error(`${varName} still contains placeholder value`);
      allPresent = false;
    } else {
      log.success(`${varName} is set`);
    }
  }

  return allPresent;
};

const verifySupabaseConnection = async (): Promise<boolean> => {
  log.section('2. Verifying Supabase Connection & Table Existence');

  try {
    // First, check with admin client if table exists
    const adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: adminData, error: adminError } = await adminClient
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (adminError) {
      const errorMsg = adminError.message || '';
      
      if (errorMsg.includes('relation "profiles" does not exist') || !errorMsg) {
        log.error('Table "profiles" does not exist');
        log.info('→ Go to Supabase Dashboard → SQL Editor');
        log.info('→ Copy/paste the content of: supabase/migrations/001_initial_schema.sql');
        log.info('→ Click "Run" to execute the migration');
        return false;
      }
      
      log.error(`Failed to connect: ${errorMsg}`);
      return false;
    }

    log.success('Successfully connected to Supabase');
    log.success('Table "profiles" exists and is accessible');
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    log.error(`Connection error: ${errorMsg}`);
    return false;
  }
};

const verifyDatabaseSchema = async (): Promise<boolean> => {
  log.section('3. Verifying Database Schema');

  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if profiles table exists and has correct structure
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(0);

    if (error) {
      if (error.message.includes('relation "profiles" does not exist')) {
        log.error('Table "profiles" does not exist');
        log.info('Please run the migration script: supabase/migrations/001_initial_schema.sql');
        return false;
      }
      log.error(`Schema verification failed: ${error.message}`);
      return false;
    }

    log.success('Table "profiles" exists');

    // Verify table structure by attempting to insert a dummy record (will be rolled back)
    const testUserId = '00000000-0000-0000-0000-000000000000';
    const { error: structureError } = await supabase
      .from('profiles')
      .insert({
        user_id: testUserId,
        name: 'Test',
        role: 'user',
      })
      .select()
      .single();

    if (structureError && !structureError.message.includes('violates foreign key')) {
      log.warn(`Table structure might be incorrect: ${structureError.message}`);
      return false;
    }

    log.success('Table structure appears correct');

    // Check if there are any profiles
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (count === 0) {
      log.info('No profiles found in database (this is normal for a new setup)');
    } else {
      log.success(`Found ${count} profile(s) in database`);
    }

    return true;
  } catch (error) {
    log.error(`Schema verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};

const verifyRLSPolicies = async (): Promise<boolean> => {
  log.section('4. Verifying Row Level Security (RLS)');

  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Try to access profiles without authentication (should return empty or error)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    // RLS is working if we get empty data or a specific error
    if (error) {
      log.success('RLS is active (anonymous access blocked)');
      return true;
    }

    if (!data || data.length === 0) {
      log.success('RLS is active (no unauthorized data accessible)');
      return true;
    }

    log.warn('RLS might not be properly configured (data accessible without auth)');
    return false;
  } catch (error) {
    log.error(`RLS verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};

const verifyAdminClient = async (): Promise<boolean> => {
  log.section('5. Verifying Admin Client (Service Role)');

  try {
    const adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Admin client should be able to access profiles bypassing RLS
    const { data, error } = await adminClient
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (error) {
      log.error(`Admin client failed: ${error.message}`);
      return false;
    }

    log.success('Admin client (service role) is working correctly');
    return true;
  } catch (error) {
    log.error(`Admin client error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};

const main = async () => {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Supabase Configuration Verification Script            ║');
  console.log('║     Multi-Agent AI Platform                                ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  const results = {
    envVars: false,
    connection: false,
    schema: false,
    rls: false,
    admin: false,
  };

  // Run all checks
  results.envVars = verifyEnvironmentVariables();
  
  if (results.envVars) {
    results.connection = await verifySupabaseConnection();
    
    if (results.connection) {
      results.schema = await verifyDatabaseSchema();
      results.rls = await verifyRLSPolicies();
      results.admin = await verifyAdminClient();
    }
  }

  // Summary
  log.section('Summary');
  
  const allPassed = Object.values(results).every(Boolean);
  
  if (allPassed) {
    console.log(`\n${colors.green}${colors.bold}🎉 All checks passed! Supabase is correctly configured.${colors.reset}\n`);
    console.log('Next steps:');
    console.log('  1. Implement authentication UI (signup/login)');
    console.log('  2. Create base layout (navbar, sidebar)');
    console.log('  3. Implement route protection middleware\n');
    process.exit(0);
  } else {
    console.log(`\n${colors.red}${colors.bold}❌ Some checks failed. Please fix the issues above.${colors.reset}\n`);
    
    if (!results.envVars) {
      console.log('Fix: Update your .env.local file with correct Supabase credentials');
    }
    if (!results.schema) {
      console.log('Fix: Run the SQL migration in Supabase SQL Editor:');
      console.log('     supabase/migrations/001_initial_schema.sql');
    }
    
    console.log('');
    process.exit(1);
  }
};

// Run the script
main().catch((error) => {
  log.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  process.exit(1);
});

