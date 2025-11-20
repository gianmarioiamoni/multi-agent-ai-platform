/**
 * Database Debug Script
 * Checks what tables exist and their structure
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

const main = async () => {
  console.log(`${colors.bold}${colors.blue}Database Debug Tool${colors.reset}\n`);

  // Use admin client to bypass RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log(`${colors.bold}1. Checking if profiles table exists...${colors.reset}`);
  
  // Query information_schema to see if table exists
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'profiles');

  if (tablesError) {
    console.log(`${colors.yellow}Cannot query information_schema (expected in some cases)${colors.reset}`);
    console.log(`Error: ${tablesError.message}\n`);
  } else if (tables && tables.length > 0) {
    console.log(`${colors.green}✓ Table "profiles" exists${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Table "profiles" does NOT exist${colors.reset}\n`);
  }

  console.log(`${colors.bold}2. Trying direct query to profiles table (with admin key)...${colors.reset}`);
  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(5);

  if (profilesError) {
    console.log(`${colors.red}✗ Error querying profiles:${colors.reset}`);
    console.log(`Message: ${profilesError.message || 'empty'}`);
    console.log(`Code: ${(profilesError as { code?: string }).code || 'none'}`);
    console.log(`Details: ${(profilesError as { details?: string }).details || 'none'}`);
    console.log(`Hint: ${(profilesError as { hint?: string }).hint || 'none'}`);
    console.log('\nFull error object:', JSON.stringify(profilesError, null, 2));
  } else {
    console.log(`${colors.green}✓ Successfully queried profiles table${colors.reset}`);
    console.log(`Records found: ${profiles?.length || 0}`);
    if (profiles && profiles.length > 0) {
      console.log('\nSample data:', JSON.stringify(profiles[0], null, 2));
    }
  }

  console.log(`\n${colors.bold}3. Listing all tables in public schema...${colors.reset}`);
  
  // Try to list all tables using a raw SQL query
  const { data: allTables, error: allTablesError } = await supabase.rpc('exec_sql', {
    query: `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `
  });

  if (allTablesError) {
    console.log(`${colors.yellow}Cannot list tables via RPC (function might not exist)${colors.reset}`);
    
    // Try alternative method
    console.log('\nTrying alternative method...');
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_tables' as never);
    
    if (schemaError) {
      console.log(`${colors.yellow}Alternative method also failed${colors.reset}`);
      console.log(`This is normal - we need to check manually in Supabase dashboard\n`);
    }
  } else {
    console.log(`${colors.green}Tables found:${colors.reset}`);
    console.log(JSON.stringify(allTables, null, 2));
  }

  console.log(`\n${colors.bold}${colors.blue}=== RECOMMENDATIONS ===${colors.reset}\n`);
  
  if (profilesError) {
    console.log(`${colors.yellow}The profiles table appears to be missing or inaccessible.${colors.reset}\n`);
    console.log('Please do the following:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to: Table Editor (left sidebar)');
    console.log('3. Check if you see a "profiles" table there');
    console.log('');
    console.log('If you DO NOT see the profiles table:');
    console.log('   → Go to SQL Editor');
    console.log('   → Create a new query');
    console.log('   → Copy the entire content of: supabase/migrations/001_initial_schema.sql');
    console.log('   → Paste and run it');
    console.log('');
    console.log('If you DO see the profiles table:');
    console.log('   → There might be an RLS policy issue');
    console.log('   → Share the error details above for more help');
  } else {
    console.log(`${colors.green}Everything looks good!${colors.reset}`);
    console.log('The profiles table exists and is accessible.');
  }
};

main().catch(console.error);

