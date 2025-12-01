/**
 * Bootstrap Admin Script
 * Creates an admin user from environment variables
 * Usage: pnpm bootstrap:admin
 */

/* eslint-disable no-console */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Load environment variables
config({ path: '.env.local' });

interface AdminConfig {
  email: string;
  password: string;
  name: string;
}

/**
 * Validates admin configuration from environment
 */
function validateAdminConfig(): AdminConfig {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!email || !password || !name) {
    throw new Error(
      'Missing required environment variables. Please set:\n' +
      '  - ADMIN_EMAIL\n' +
      '  - ADMIN_PASSWORD\n' +
      '  - ADMIN_NAME\n' +
      'in your .env.local file'
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid ADMIN_EMAIL format');
  }

  // Validate password strength
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters long');
  }

  return { email, password, name };
}

/**
 * Creates Supabase admin client with service role
 */
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase configuration. Please set:\n' +
      '  - NEXT_PUBLIC_SUPABASE_URL\n' +
      '  - SUPABASE_SERVICE_ROLE_KEY\n' +
      'in your .env.local file'
    );
  }

  const client = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return client;
}

/**
 * Main bootstrap function
 */
async function bootstrapAdmin() {
  console.log('🚀 Starting admin bootstrap process...\n');

  try {
    // Validate configuration
    console.log('1️⃣ Validating configuration...');
    const config = validateAdminConfig();
    console.log(`   ✅ Email: ${config.email}`);
    console.log(`   ✅ Name: ${config.name}`);
    console.log(`   ✅ Password: ${'*'.repeat(config.password.length)}\n`);

    // Create admin client
    console.log('2️⃣ Connecting to Supabase...');
    const supabase = createAdminClient();
    console.log('   ✅ Connected\n');

    // Check if user already exists
    console.log('3️⃣ Checking if admin user exists...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const existingUser = existingUsers.users.find(u => u.email === config.email);

    let userId: string;

    if (existingUser) {
      console.log(`   ⚠️  User already exists with ID: ${existingUser.id}`);
      userId = existingUser.id;

      // Check if already admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if ((profile as { role?: string } | null)?.role === 'admin') {
        console.log('   ✅ User is already an admin\n');
        console.log('✅ Admin bootstrap completed successfully!');
        return;
      }

      console.log('   ℹ️  User exists but is not admin, upgrading...\n');
    } else {
      // Create new user
      console.log('   ℹ️  User does not exist, creating...');
      const { data, error } = await supabase.auth.admin.createUser({
        email: config.email,
        password: config.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: config.name,
        },
      });

      if (error) {
        throw new Error(`Failed to create user: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('User creation succeeded but no user data returned');
      }

      userId = data.user.id;
      console.log(`   ✅ User created with ID: ${userId}\n`);
    }

    // Update or create profile with admin role
    console.log('4️⃣ Setting up admin profile...');
    const profileData = {
      user_id: userId,
      name: config.name,
      role: 'admin' as const,
      updated_at: new Date().toISOString(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: profileError } = await (supabase.from('profiles') as any).upsert(profileData, {
      onConflict: 'user_id',
    });

    if (profileError) {
      throw new Error(`Failed to create/update profile: ${profileError.message}`);
    }

    console.log('   ✅ Admin profile configured\n');

    // Verify admin access
    console.log('5️⃣ Verifying admin access...');
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (verifyError || !verifyProfile) {
      throw new Error('Failed to verify admin profile');
    }

    if ((verifyProfile as { role?: string } | null)?.role !== 'admin') {
      throw new Error('Profile created but role is not admin');
    }

    console.log('   ✅ Admin access verified\n');

    console.log('✅ Admin bootstrap completed successfully!');
    console.log('\nAdmin credentials:');
    console.log(`   Email: ${config.email}`);
    console.log(`   Password: ${'*'.repeat(config.password.length)}`);
    console.log(`   Name: ${config.name}`);
    console.log('\nYou can now log in with these credentials.');

  } catch (error) {
    console.error('\n❌ Bootstrap failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error('   Unknown error occurred');
    }
    process.exit(1);
  }
}

// Run bootstrap
bootstrapAdmin();

