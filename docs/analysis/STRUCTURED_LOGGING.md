# Structured Logging System

## Overview

The platform uses a structured logging system that stores logs in Supabase for debugging, monitoring, and audit trails. All logs are categorized and include contextual information for easy filtering and analysis.

## Database Schema

The `logs` table stores structured log entries with the following fields:

- **level**: Log severity (`debug`, `info`, `warn`, `error`, `critical`)
- **category**: Log category for filtering (e.g., `agent.execution`, `workflow.engine`)
- **message**: Human-readable log message
- **context**: Additional context as JSONB
- **Related entities**: Optional foreign keys to `user_id`, `agent_id`, `workflow_id`, `workflow_run_id`, `agent_run_id`
- **Error details**: `error_type`, `error_message`, `stack_trace` for error logs
- **Request tracking**: `request_id` for tracing requests across services
- **Performance**: `duration_ms` for execution time tracking

## Log Levels

- **debug**: Detailed information for debugging
- **info**: General informational messages
- **warn**: Warning messages for potential issues
- **error**: Error messages that need attention
- **critical**: Critical errors that require immediate action

## Log Categories

Current categories:
- `agent.execution` - Agent execution logs
- `agent.error` - Agent error logs
- `workflow.engine` - Workflow execution logs
- `workflow.error` - Workflow error logs
- `tool.calendar` - Calendar tool logs
- `tool.email` - Email tool logs
- `tool.web_search` - Web search tool logs
- `tool.db_ops` - DB operations tool logs
- `tool.error` - Tool error logs
- `rate_limit` - Rate limiting logs
- `auth` - Authentication logs
- `api` - API logs
- `database` - Database logs
- `system` - System logs

## Usage

### Basic Logging

```typescript
import { logInfo, logError, logWarn } from '@/lib/logging/logger';

// Info log
await logInfo('agent.execution', 'Agent started', { agentId: '123' });

// Error log
await logError('agent.error', 'Agent execution failed', error, { agentId: '123' });

// Warning log
await logWarn('rate_limit', 'Rate limit approaching', { userId: '456' });
```

### Scoped Logging

For consistent logging with default context:

```typescript
import { createScopedLogger } from '@/lib/logging/logger';

const logger = createScopedLogger({
  category: 'workflow.engine',
  workflowId: '123',
  userId: '456',
  requestId: 'req-789',
});

// All logs will include the default context
await logger.info('Workflow started');
await logger.error('Step failed', error, { stepOrder: 1 });
```

### Error Handling with Logging

```typescript
import { handleError } from '@/lib/errors/error-handler';

try {
  // ... code ...
} catch (error) {
  const userMessage = await handleError(error, 'agent_execution', {
    agentId: '123',
  });
  // Error is automatically logged and user-friendly message returned
}
```

## RLS Policies

- **Users**: Can view logs related to their own agents/workflows/runs
- **Admins**: Can view all logs
- **Service role**: Can insert logs (for application logging)

## Querying Logs

### View Logs via SQL

```sql
-- Recent errors
SELECT * FROM logs
WHERE level = 'error'
ORDER BY created_at DESC
LIMIT 100;

-- Agent execution logs
SELECT * FROM logs
WHERE category = 'agent.execution'
AND agent_id = 'your-agent-id'
ORDER BY created_at DESC;

-- Workflow run logs
SELECT * FROM logs
WHERE workflow_run_id = 'your-run-id'
ORDER BY created_at ASC;

-- Errors in last 24 hours
SELECT * FROM logs
WHERE level IN ('error', 'critical')
AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Filter by Category

```sql
-- All workflow-related logs
SELECT * FROM logs
WHERE category LIKE 'workflow.%'
ORDER BY created_at DESC;
```

## Maintenance

### Clean Old Logs

The `clean_old_logs()` function removes old debug/info logs (keeps errors/warnings longer):

```sql
-- Remove logs older than 30 days (debug/info only)
SELECT clean_old_logs(30);
```

For production, set up a scheduled job to run this periodically.

## Integration

The logging system is integrated into:
- ✅ Agent execution (`executeAgent`)
- ✅ Workflow execution (`executeWorkflow`, `runWorkflow`)
- ✅ Error handling (via `handleError`)

Future integrations:
- Tool execution
- API routes
- Authentication flows

## Best Practices

1. **Use appropriate log levels**: Don't log everything as `error`
2. **Include context**: Add relevant IDs and metadata
3. **Use categories**: Helps filter and organize logs
4. **Log errors with stack traces**: Automatic with `logError()`
5. **Don't log sensitive data**: Avoid passwords, tokens, etc.
6. **Use request IDs**: For tracing requests across services

## Performance

- Logging is asynchronous and non-blocking
- If database write fails, falls back to console logging
- Indexes optimized for common query patterns
- Consider log retention policies for large deployments

