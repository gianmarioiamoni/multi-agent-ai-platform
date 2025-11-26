# Apply Migration 008: Add Demo User Flag

This migration adds an `is_demo` boolean field to the `profiles` table to mark demo accounts.

## What this migration does

1. Adds `is_demo` column to `profiles` table:
   - Type: `BOOLEAN NOT NULL DEFAULT false`
   - Marks users as demo accounts
   - Demo users cannot change password or delete account

2. Creates index for performance:
   - `idx_profiles_is_demo` on `is_demo` column

## How to apply

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/008_add_demo_user_flag.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

### Option 2: Via Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Manual execution

1. Connect to your Supabase database
2. Execute the SQL from `supabase/migrations/008_add_demo_user_flag.sql`

## Verification

After applying the migration, verify:

1. **Column exists:**
   ```sql
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_name = 'profiles'
   AND column_name = 'is_demo';
   ```

2. **Index exists:**
   ```sql
   SELECT indexname 
   FROM pg_indexes 
   WHERE tablename = 'profiles'
   AND indexname = 'idx_profiles_is_demo';
   ```

## Usage

After migration, admins can mark users as demo via the admin panel:
1. Go to `/admin` page
2. Find the user in the users table
3. Click "Set as Demo" button in the Demo column
4. Demo users will have restrictions on password change and account deletion

## Notes

- All existing users will have `is_demo = false` by default
- Demo flag can be set/unset by admins via UI
- Demo users are automatically protected from password changes and account deletion

