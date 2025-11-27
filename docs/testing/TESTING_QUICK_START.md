# Quick Start Testing Guide

## Test Logging and Error Handling

### 1. Run Automated Test

```bash
pnpm test:logging
```

This tests:
- ✅ Log functions
- ✅ Error handling
- ✅ Database storage
- ✅ User-friendly messages

### 2. Test in UI

1. **Test Agent Execution**:
   - Go to `/app/agents`
   - Click on an agent
   - Click "Test Agent"
   - Send a message
   - Check logs in database (see below)

2. **Test Workflow Execution**:
   - Go to `/app/workflows`
   - Click on a workflow
   - Click "Run"
   - Provide input
   - Check logs in database (see below)

3. **Test Error Messages**:
   - Try to execute agent with empty message → Should see friendly error
   - Try rapid requests → Should see rate limit message
   - Try inactive agent → Should see appropriate message

### 3. Verify Logs in Database

Open Supabase SQL Editor and run:

```sql
-- Recent logs
SELECT 
  level,
  category,
  message,
  created_at
FROM logs
ORDER BY created_at DESC
LIMIT 20;

-- Error logs only
SELECT * FROM logs
WHERE level = 'error'
ORDER BY created_at DESC
LIMIT 10;

-- Agent execution logs
SELECT * FROM logs
WHERE category = 'agent.execution'
ORDER BY created_at DESC
LIMIT 10;
```

### Expected Results

- ✅ Logs are stored in database
- ✅ Error messages are user-friendly
- ✅ Context information is included
- ✅ Request IDs enable tracing

🎉 If all tests pass, logging and error handling are working correctly!

