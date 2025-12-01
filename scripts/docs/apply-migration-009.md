# Apply Migration 009: Add User Disabled Flag

## Overview
This migration adds an `is_disabled` boolean field to the `profiles` table, allowing admins to disable/enable user accounts. Disabled users cannot log in.

## Migration File
- **File**: `supabase/migrations/009_add_user_disabled_flag.sql`

## Steps to Apply

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Open the migration file: `supabase/migrations/009_add_user_disabled_flag.sql`
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **Run** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows/Linux)
8. Verify the migration succeeded

### Option 2: Using Supabase CLI

If you have Supabase CLI installed and linked:

```bash
# Navigate to project root
cd /path/to/multi-agent-ai-platform

# Apply the migration
supabase db push

# Or if you're using migrations directly:
supabase migration up
```

### Option 3: Manual Application

1. Connect to your Supabase database using your preferred PostgreSQL client
2. Open `supabase/migrations/009_add_user_disabled_flag.sql`
3. Execute the SQL statements

## Verification

After applying the migration, verify it worked:

```sql
-- Check if column exists
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'is_disabled';

-- Should return:
-- column_name: is_disabled
-- data_type: boolean
-- column_default: false
-- is_nullable: NO

-- Check if index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
  AND indexname = 'idx_profiles_is_disabled';

-- Check existing users (all should have is_disabled = false by default)
SELECT user_id, email, role, is_disabled
FROM profiles
LIMIT 10;
```

## What This Migration Does

1. **Adds `is_disabled` column**: A boolean field that defaults to `false` (all existing users remain enabled)
2. **Creates an index**: For faster queries when filtering by disabled status
3. **Updates RLS policies**: Allows admins to update the `is_disabled` field for any user

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Remove RLS policy
DROP POLICY IF EXISTS "Admins can update user disabled status" ON profiles;

-- Remove index
DROP INDEX IF EXISTS idx_profiles_is_disabled;

-- Remove column
ALTER TABLE profiles DROP COLUMN IF EXISTS is_disabled;
```

## Next Steps

After applying this migration:

1. Update TypeScript types in `src/types/database.types.ts` to include `is_disabled`
2. Update `UserProfile` interface in `src/lib/auth/utils.ts`
3. Modify login flow to check `is_disabled` before allowing sign-in
4. Add admin UI components for enabling/disabling users
5. Add delete user functionality

## Notes

- All existing users will have `is_disabled = false` by default
- Only admins can update the `is_disabled` field (via RLS policy)
- Disabled users will be prevented from logging in (check will be added in application code)

