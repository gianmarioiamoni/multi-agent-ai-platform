# Apply Migration 010 Updated - Subscription Fields with Trial Used

This migration updates the subscription system to:
1. Add `trial_used` field to track if user already used their trial
2. Update `handle_new_user()` to automatically assign trial to new users
3. Ensure admin users have no subscription (unlimited access)
4. Properly initialize existing users with trial

## Steps

1. **Run the migration in Supabase Dashboard:**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `supabase/migrations/010_add_subscription_fields.sql`
   - Execute the migration

2. **Update existing database function:**
   - The migration updates `handle_new_user()` function
   - This ensures new users automatically get trial subscription

3. **Verify the migration:**
   ```sql
   -- Check that trial_used column exists
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_name = 'profiles' AND column_name = 'trial_used';

   -- Check that admin users have NULL subscription_plan
   SELECT id, role, subscription_plan, subscription_expires_at, trial_used
   FROM profiles
   WHERE role = 'admin';

   -- Check that regular users have trial assigned
   SELECT id, role, subscription_plan, subscription_expires_at, trial_used
   FROM profiles
   WHERE role = 'user' AND is_demo = false;
   ```

## Expected Results

- ✅ All admin users have `subscription_plan = NULL`
- ✅ All regular users have `subscription_plan = 'trial'` (if not expired)
- ✅ Users with expired trials have `trial_used = true`
- ✅ New users will automatically get trial assigned on signup

