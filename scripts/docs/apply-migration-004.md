# Apply Migration 004 - Workflow Execution Tables

This migration adds tables for tracking workflow executions:
- `workflow_runs` - Execution history of workflows
- `agent_runs` - Individual agent executions within workflow runs
- `tool_invocations` - Log of all tool calls made by agents

## Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New query**
4. Open the file `supabase/migrations/004_workflow_execution_tables.sql`
5. Copy the entire content
6. Paste it into the SQL Editor
7. Click **Run** to execute
8. Verify there are no errors

## Option 2: Via Supabase CLI

```bash
# If you have Supabase CLI installed and linked
supabase db push

# Or manually apply the migration
supabase migration up
```

## Verification

After applying the migration, verify the tables were created:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('workflow_runs', 'agent_runs', 'tool_invocations');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('workflow_runs', 'agent_runs', 'tool_invocations');
```

## Next Steps

After applying this migration:
1. Update TypeScript types in `src/types/database.types.ts`
2. Implement workflow engine in `src/lib/workflows/`
3. Create UI for workflows page

---

**Related**: Sprint 3, Week 5 - Multi-agent workflow execution

