# Apply Migration 012 - Subscription Notification Tracking

## Overview
Creates a table to track sent subscription notification emails and prevent duplicates.

## Steps

1. **Run the migration in Supabase Dashboard:**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `supabase/migrations/012_subscription_notification_tracking.sql`
   - Execute the migration

2. **Verify the migration:**
   ```sql
   -- Check that table exists
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_name = 'subscription_notifications';

   -- Check columns
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'subscription_notifications';
   ```

## Expected Results

- ✅ Table `subscription_notifications` created
- ✅ Indexes created for performance
- ✅ RLS policies enabled
- ✅ Ready to track notification sends

