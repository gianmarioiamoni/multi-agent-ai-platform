# Testing Logging and Error Handling

## Overview

This guide helps you test the structured logging system and improved error handling.

## Prerequisites

1. ✅ Migration 006 applied (see `scripts/apply-migration-006.md`)
2. ✅ Upstash Redis configured (for rate limiting)
3. ✅ At least one agent created
4. ✅ At least one workflow created

## Test 1: Basic Logging Test

Run the automated test script:

```bash
pnpm test:logging
```

This will:
- Test basic log functions (info, warn, error)
- Test scoped logger
- Test error handling with user-friendly messages
- Verify logs are stored in database
- Display recent log entries

## Test 2: Agent Execution with Logging

### Steps

1. **Open the application**:
   ```
   http://localhost:3000/app/agents
   ```

2. **Click on an agent** to open the detail page

3. **Click "Test Agent"** and send a message

4. **Verify in database**:
   ```sql
   SELECT 
     level,
     category,
     message,
     context,
     agent_id,
     user_id,
     created_at
   FROM logs
   WHERE category = 'agent.execution'
   ORDER BY created_at DESC
   LIMIT 10;
   ```

### Expected Logs

You should see logs like:
- `[INFO] agent.execution: Starting agent execution`
- `[INFO] agent.execution: Orchestrating agent`
- `[INFO] agent.execution: Agent execution completed`

## Test 3: Workflow Execution with Logging

### Steps

1. **Open workflows page**:
   ```
   http://localhost:3000/app/workflows
   ```

2. **Click on a workflow** and click "Run"

3. **Provide input** and execute

4. **Verify in database**:
   ```sql
   SELECT 
     level,
     category,
     message,
     workflow_id,
     workflow_run_id,
     agent_run_id,
     context,
     created_at
   FROM logs
   WHERE category = 'workflow.engine'
   ORDER BY created_at DESC
   LIMIT 20;
   ```

### Expected Logs

You should see logs like:
- `[INFO] workflow.engine: Starting workflow execution`
- `[INFO] workflow.engine: Executing step 1/3`
- `[INFO] workflow.engine: Step 1 completed: Step Name`
- `[INFO] workflow.engine: Workflow execution completed`

## Test 4: Error Handling - User-Friendly Messages

### Test Authentication Error

1. **Logout** from the application
2. Try to **execute an agent** (should redirect, but if you hit API directly)
3. **Expected message**: "You must be logged in to perform this action."

### Test Not Found Error

1. Try to access a **non-existent agent ID** via API
2. **Expected message**: "The requested agent could not be found."

### Test Validation Error

1. Try to **execute an agent with empty message**
2. **Expected message**: "Please provide a message to send to the agent."

### Test Rate Limit Error

1. Make **10+ rapid requests** to execute an agent
2. **Expected message**: "Rate limit exceeded. Please try again in X minute(s). You can make 10 requests per minute."

### Test Inactive Agent

1. **Deactivate an agent** (if you have admin access)
2. Try to **execute it**
3. **Expected message**: "This agent is currently inactive. Please activate it before running."

## Test 5: Error Logging

### Steps

1. **Create an agent** without proper configuration (e.g., invalid model)
2. **Try to execute it**
3. **Check logs**:
   ```sql
   SELECT 
     level,
     category,
     message,
     error_type,
     error_message,
     stack_trace,
     context
   FROM logs
   WHERE level IN ('error', 'critical')
   ORDER BY created_at DESC
   LIMIT 10;
   ```

### Expected

- Errors are logged with full context
- Stack traces are captured
- Error types are categorized

## Test 6: Scoped Logging Context

### Verify Request Tracing

1. Execute a workflow
2. **Query logs with request ID**:
   ```sql
   SELECT 
     request_id,
     level,
     category,
     message,
     created_at
   FROM logs
   WHERE request_id IS NOT NULL
   ORDER BY created_at ASC;
   ```

### Expected

- All logs from same execution have same `request_id`
- Can trace full execution flow
- Context includes relevant IDs (workflow_id, agent_id, etc.)

## Test 7: Performance Tracking

### Check Execution Times

```sql
SELECT 
  category,
  message,
  duration_ms,
  created_at
FROM logs
WHERE duration_ms IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;
```

## Monitoring in Production

### Common Queries

**Recent Errors**:
```sql
SELECT * FROM logs
WHERE level IN ('error', 'critical')
AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

**Agent Execution Stats**:
```sql
SELECT 
  agent_id,
  COUNT(*) as execution_count,
  COUNT(*) FILTER (WHERE level = 'error') as error_count,
  AVG(duration_ms) as avg_duration_ms
FROM logs
WHERE category = 'agent.execution'
AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY agent_id;
```

**Workflow Success Rate**:
```sql
SELECT 
  workflow_id,
  COUNT(*) FILTER (WHERE level = 'info' AND message LIKE '%completed%') as completed,
  COUNT(*) FILTER (WHERE level = 'error') as failed
FROM logs
WHERE category = 'workflow.engine'
AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY workflow_id;
```

## Troubleshooting

### No Logs in Database

1. Verify migration 006 is applied
2. Check RLS policies are correct
3. Verify service role key is configured
4. Check console for fallback logs

### Error: "Table logs does not exist"

Run migration 006:
```bash
# See scripts/apply-migration-006.md
```

### Logs Not Showing for User

1. Check RLS policies
2. Verify user owns the related entities
3. Admin users should see all logs

### Performance Issues

1. Consider adding more indexes
2. Clean old logs regularly
3. Monitor log volume

## Next Steps

After testing:
- ✅ Verify all logs are being created
- ✅ Confirm error messages are user-friendly
- ✅ Check performance metrics are tracked
- ✅ Ensure request IDs are working for tracing

