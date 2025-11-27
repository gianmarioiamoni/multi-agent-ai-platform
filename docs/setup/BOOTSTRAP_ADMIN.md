# Bootstrap Admin User

This guide explains how to create an admin user for your Multi-Agent AI Platform.

## Overview

The `bootstrap:admin` script creates an admin user from environment variables. This is the recommended way to set up the first admin user for your platform.

## Prerequisites

- Supabase project configured
- `.env.local` file with Supabase credentials

## Configuration

Add the following variables to your `.env.local` file:

```bash
# Admin User Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Admin User
```

### Requirements

- **ADMIN_EMAIL**: Must be a valid email format
- **ADMIN_PASSWORD**: Must be at least 8 characters long (use a strong password in production)
- **ADMIN_NAME**: Display name for the admin user

## Usage

Run the bootstrap script:

```bash
pnpm bootstrap:admin
```

## What the Script Does

1. **Validates Configuration**: Checks that all required environment variables are set and valid
2. **Connects to Supabase**: Uses the service role key to perform admin operations
3. **Checks Existing User**: Verifies if a user with the admin email already exists
4. **Creates/Updates User**: 
   - If user doesn't exist: Creates new user with auto-confirmed email
   - If user exists: Upgrades existing user to admin role
5. **Sets Up Profile**: Creates or updates the user profile with `role='admin'`
6. **Verifies Access**: Confirms the admin user was created successfully

## Output

Successful execution will show:

```
🚀 Starting admin bootstrap process...

1️⃣ Validating configuration...
   ✅ Email: admin@example.com
   ✅ Name: Admin User
   ✅ Password: ********

2️⃣ Connecting to Supabase...
   ✅ Connected

3️⃣ Checking if admin user exists...
   ℹ️  User does not exist, creating...
   ✅ User created with ID: ...

4️⃣ Setting up admin profile...
   ✅ Admin profile configured

5️⃣ Verifying admin access...
   ✅ Admin access verified

✅ Admin bootstrap completed successfully!

Admin credentials:
   Email: admin@example.com
   Password: ********
   Name: Admin User

You can now log in with these credentials.
```

## Idempotency

The script is idempotent - you can run it multiple times safely:

- If the admin user already exists with admin role: No changes are made
- If the user exists but is not admin: The user is upgraded to admin
- If the user doesn't exist: A new admin user is created

## Security Best Practices

### Development

- Use a simple password for local development
- Store credentials in `.env.local` (never commit this file)

### Production

- Use a strong, unique password (16+ characters, mixed case, numbers, symbols)
- Store credentials in your hosting platform's environment variables
- Change the password immediately after first login
- Consider using a password manager to generate and store the password
- Run the script once during deployment, then remove or rotate the credentials

## Troubleshooting

### Missing Environment Variables

```
❌ Bootstrap failed:
   Missing required environment variables. Please set:
   - ADMIN_EMAIL
   - ADMIN_PASSWORD
   - ADMIN_NAME
```

**Solution**: Add all required variables to `.env.local`

### Invalid Email Format

```
❌ Bootstrap failed:
   Invalid ADMIN_EMAIL format
```

**Solution**: Use a valid email address (e.g., `admin@example.com`)

### Password Too Short

```
❌ Bootstrap failed:
   ADMIN_PASSWORD must be at least 8 characters long
```

**Solution**: Use a password with at least 8 characters

### Supabase Connection Error

```
❌ Bootstrap failed:
   Missing Supabase configuration
```

**Solution**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in `.env.local`

### Profile Creation Failed

```
❌ Bootstrap failed:
   Failed to create/update profile: ...
```

**Solution**: 
1. Check that the `profiles` table exists
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Verify RLS policies allow the service role to insert/update profiles

## Next Steps

After creating the admin user:

1. Log in at `/auth/login` with your admin credentials
2. Access the Admin Panel at `/admin`
3. Configure additional admin users if needed (coming in Sprint 1, Week 2)
4. Set up system-wide configuration

## Related Documentation

- [Supabase Setup](./SUPABASE_SETUP.md)
- [Authentication Testing](./TESTING_AUTH.md)
- [RLS Policies](./FIX_RLS_RECURSION.md)

