# Apply Migration 007: Notification Reads Table

This migration creates the `notification_reads` table to track read status of notifications in the database.

## What this migration does

1. Creates `notification_reads` table:
   - `id`: UUID primary key
   - `user_id`: Reference to auth.users
   - `notification_id`: String identifier (e.g., "workflow-{run_id}-completed")
   - `read_at`: Timestamp when marked as read
   - `created_at`: Record creation timestamp
   - Unique constraint on `(user_id, notification_id)`

2. Creates indexes for performance:
   - `idx_notification_reads_user_id`
   - `idx_notification_reads_notification_id`
   - `idx_notification_reads_read_at`
   - `idx_notification_reads_user_notification` (composite)

3. Sets up Row Level Security (RLS):
   - Users can view/create their own notification reads
   - Admins can view all notification reads

## How to apply

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/007_notification_reads.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

### Option 2: Via Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Manual execution

1. Connect to your Supabase database
2. Execute the SQL from `supabase/migrations/007_notification_reads.sql`

## Verification

After applying the migration, verify:

1. **Table exists:**
   ```sql
   SELECT * FROM notification_reads LIMIT 1;
   ```

2. **RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'notification_reads';
   ```
   Should return `rowsecurity = true`

3. **Indexes are created:**
   ```sql
   SELECT indexname 
   FROM pg_indexes 
   WHERE tablename = 'notification_reads';
   ```

## Notes

- This migration replaces localStorage-based notification tracking
- Read status is now persisted in the database and synced across devices
- Old localStorage data will not be migrated (users start fresh)
- The unique constraint prevents duplicate read entries

## Rollback (if needed)

To rollback this migration:

```sql
DROP TABLE IF EXISTS notification_reads CASCADE;
```

**Warning:** This will delete all notification read status data.

