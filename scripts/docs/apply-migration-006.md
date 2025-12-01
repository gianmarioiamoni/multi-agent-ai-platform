# Apply Migration 006: Structured Logging

## Overview

This migration creates the `logs` table for structured application logging.

## Steps

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to SQL Editor

2. **Run the Migration**
   - Copy the contents of `supabase/migrations/006_structured_logging.sql`
   - Paste into SQL Editor
   - Click "Run"

3. **Verify**
   - Check that the `logs` table exists
   - Verify RLS policies are enabled
   - Confirm indexes are created
   - Test log insertion (optional)

## Testing

After applying the migration, test logging:

```typescript
import { logInfo } from '@/lib/logging/logger';

await logInfo('system', 'Test log entry', { test: true });
```

Then query the logs table:

```sql
SELECT * FROM logs ORDER BY created_at DESC LIMIT 10;
```

## Cleanup (Optional)

To clean old logs:

```sql
-- Remove logs older than 30 days (debug/info only)
SELECT clean_old_logs(30);
```

For production, set up a scheduled job to run this periodically.

