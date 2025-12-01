/**
 * Check Profile Script
 * Verify if profile exists for a user
 */

/* eslint-disable no-console */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const main = async () => {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Usage: pnpm check:profile <email>');
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log(`\n🔍 Checking user and profile for: ${email}\n`);

  // 1. Check if user exists in auth.users
  const { data: { users } } = await supabase.auth.admin.listUsers();
  
  const user = users?.find(u => u.email === email);
  
  if (!user) {
    console.log('❌ User not found in auth.users');
    console.log('   User needs to sign up first');
    return;
  }

  console.log('✅ User exists in auth.users');
  console.log('   User ID:', user.id);
  console.log('   Email:', user.email);
  console.log('   Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');
  console.log('   Created at:', user.created_at);

  // 2. Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  console.log('\n');

  if (profileError) {
    console.log('❌ Profile not found in profiles table');
    console.log('   Error code:', profileError.code);
    console.log('   Error message:', profileError.message);
    console.log('\n');
    console.log('🔧 Solution: Create profile manually or check trigger');
    
    // Offer to create profile
    console.log('\n💡 Creating profile now...');
    
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'user',
      })
      .select()
      .single();

    if (createError) {
      console.log('❌ Failed to create profile:', createError.message);
    } else {
      console.log('✅ Profile created successfully!');
      console.log('   Profile ID:', newProfile.id);
      console.log('   Name:', newProfile.name);
      console.log('   Role:', newProfile.role);
    }
    
    return;
  }

  console.log('✅ Profile exists in profiles table');
  console.log('   Profile ID:', profile.id);
  console.log('   User ID:', profile.user_id);
  console.log('   Name:', profile.name);
  console.log('   Role:', profile.role);
  console.log('   Settings:', profile.settings);
  console.log('   Created at:', profile.created_at);

  // 3. Check trigger exists
  console.log('\n🔍 Checking database trigger...');
  
  const { data: triggers, error: triggerError } = await supabase.rpc('exec_sql', {
    query: `
      SELECT 
        trigger_name,
        event_manipulation,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'users'
      AND trigger_schema = 'auth';
    `
  } as never);

  if (triggerError) {
    console.log('⚠️  Could not check triggers (this is ok)');
  } else {
    console.log('Triggers:', triggers);
  }

  console.log('\n✅ All checks completed!\n');
};

main().catch(console.error);

