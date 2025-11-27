# Apply Migration 010: Add tool_configs Table

## Migration File
`supabase/migrations/010_add_tool_configs.sql`

## Purpose
Creates the `tool_configs` table for storing global tool configurations managed by admin users. This allows tools to be configured via UI instead of environment variables.

## Steps

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `multi-agent-ai-platform`
3. Navigate to: **SQL Editor**
4. Click **"New query"**
5. Open the file `supabase/migrations/010_add_tool_configs.sql`
6. Copy the entire content
7. Paste it into the SQL Editor
8. Click **"Run"** to execute
9. Verify there are no errors

### Option 2: Via Supabase CLI

```bash
# Make sure you're in the project root
cd /Users/gianmarioiamoni/PROGRAMMAZIONE/Projects/multi-agent-ai-platform

# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Push the migration
supabase db push
```

## Verification

After applying the migration, verify:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see a new table: `tool_configs`
3. Check the table structure:
   - `id` (UUID)
   - `tool_id` (TEXT, UNIQUE)
   - `config` (JSONB)
   - `enabled` (BOOLEAN)
   - `updated_by` (UUID, nullable)
   - `created_at` (TIMESTAMPTZ)
   - `updated_at` (TIMESTAMPTZ)

## Next Steps

After the migration is applied:

1. ✅ Access `/admin/settings` as admin user
2. ✅ Configure Email Tool (SMTP or Resend)
3. ✅ Configure Web Search Tool (Tavily API key)
4. ✅ Configure OpenAI (API key, rate limits)
5. ⏭️ Tools will automatically use database configs (once refactored)

## Rollback (if needed)

To rollback this migration:

```sql
DROP TRIGGER IF EXISTS trigger_update_tool_configs_updated_at ON tool_configs;
DROP FUNCTION IF EXISTS update_tool_configs_updated_at();
DROP TABLE IF EXISTS tool_configs;
```

⚠️ **Warning**: This will delete all tool configurations!

