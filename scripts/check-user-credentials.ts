/**
 * Check User Credentials Script
 * Verifies if a user exists in Supabase Auth
 */

/* eslint-disable no-console */
import { config } from 'dotenv';
import { createAdminClient } from '@/lib/supabase/admin';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: pnpm tsx scripts/check-user-credentials.ts <email>');
    process.exit(1);
  }

  console.log(`\n🔍 Checking user credentials for: ${email}\n`);

  try {
    const supabase = createAdminClient();

    // List all users and find the one with matching email
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Error listing users:', error.message);
      process.exit(1);
    }

    const user = users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      console.log('❌ User not found in Supabase Auth');
      console.log(`\n📋 Available users (${users?.length || 0}):`);
      users?.forEach((u) => {
        console.log(`  - ${u.email} (ID: ${u.id})`);
      });
      process.exit(1);
    }

    console.log('✅ User found in Supabase Auth');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email confirmed: ${user.email_confirmed_at ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   Created at: ${user.created_at}`);
    console.log(`   Last sign in: ${user.last_sign_in_at || 'Never'}`);

    if (!user.email_confirmed_at) {
      console.log('\n⚠️  WARNING: Email is not confirmed!');
      console.log('   This might prevent login if email confirmation is required.');
    }

    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.log('\n❌ Profile not found in database');
    } else {
      console.log('\n✅ Profile found in database');
      console.log(`   Name: ${profile.name || 'N/A'}`);
      console.log(`   Role: ${profile.role}`);
    }

    console.log('\n💡 Tips:');
    console.log('   - If email is not confirmed, check Supabase Dashboard → Authentication → Email Templates');
    console.log('   - If password is wrong, use Supabase Dashboard → Authentication → Users to reset it');
    console.log('   - Make sure you are using the exact email (case-insensitive)');
    console.log('');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

main().catch(console.error);

