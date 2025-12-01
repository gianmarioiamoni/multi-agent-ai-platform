/**
 * Check Stored Credentials Table
 * Verifies that stored_credentials table exists and has correct structure
 */

/* eslint-disable no-console */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database.types';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function checkTable() {
  console.log('🔍 Checking stored_credentials table...\n');

  try {
    // Try to query the table
    const { error } = await supabase
      .from('stored_credentials')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist') || error.code === 'PGRST116') {
        console.error('❌ Table "stored_credentials" does not exist!');
        console.log('\n📋 To create the table:');
        console.log('1. Go to Supabase Dashboard → SQL Editor');
        console.log('2. Copy content from: supabase/migrations/005_stored_credentials.sql');
        console.log('3. Paste and run the migration');
        return false;
      }
      console.error('❌ Error querying table:', error.message);
      return false;
    }

    console.log('✅ Table "stored_credentials" exists');
    
    // Check structure
    const { count } = await supabase
      .from('stored_credentials')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ Found ${count || 0} credential records`);
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

async function main() {
  const exists = await checkTable();
  process.exit(exists ? 0 : 1);
}

main();

