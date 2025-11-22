# Tools Setup Guide

Configuration guide for agent tools.

## Web Search Tool ✅

The Web Search tool uses **Tavily API** for real-time web search.

### Setup

1. **Get Tavily API Key**
   - Sign up at [tavily.com](https://tavily.com)
   - Get your API key from the dashboard

2. **Configure Environment Variable**
   
   Add to `.env.local`:
   ```bash
   TAVILY_API_KEY=tvly-xxxxxxxxxxxxx
   ```

3. **Verify Setup**
   
   The tool will automatically be available once the API key is configured.
   
   Test it by creating an agent with "Web Search" tool enabled.

### Features

- ✅ Real-time web search
- ✅ Up to 10 results per query
- ✅ Automatic retry on failure (2 attempts)
- ✅ 10-second timeout
- ✅ Detailed error logging
- ✅ Execution time tracking

### Usage Example

```typescript
import { executeTool } from '@/lib/tools/registry';

const result = await executeTool('web_search', {
  query: 'Latest AI developments',
  maxResults: 5,
});

if (result.success) {
  console.log(result.data.results);
}
```

### Error Handling

The tool handles:
- Missing API key
- Empty queries
- API errors
- Timeouts (10s)
- Network failures

All errors are logged with context for debugging.

---

## Email Tool 🚧 (Coming Soon - Week 4)

Send emails via SendGrid/Resend/Mailgun.

### Planned Features
- Send emails
- HTML templates
- Attachments support
- Admin-configurable credentials

---

## Calendar Tool 🚧 (Coming Soon - Week 6)

Google Calendar integration.

### Planned Features
- List upcoming events
- Create events
- OAuth per-user
- Encrypted token storage

---

## Database Operations Tool 🚧 (Coming Soon - Week 6)

Safe database operations via typed API endpoints.

### Planned Features
- Get records
- Create/Update/Delete
- Type-safe queries
- No raw SQL access
- RLS enforcement

---

## Tool Architecture

### Tool Interface

```typescript
interface Tool<TParams, TResult> {
  id: ToolId;
  name: string;
  description: string;
  paramsSchema: JSONSchema;
  execute: (params: TParams) => Promise<ToolResult<TResult>>;
}
```

### Tool Registry

Centralized registry at `src/lib/tools/registry.ts`:

```typescript
// Get tool
const tool = getTool('web_search');

// Execute tool
const result = await executeTool('web_search', params);

// Get schemas for OpenAI function calling
const schemas = getToolSchemas(['web_search', 'email']);

// Check availability
const available = isToolAvailable('web_search');
```

### Adding New Tools

1. Create tool file in `src/lib/tools/`
2. Implement `Tool` interface
3. Add error handling and logging
4. Register in `registry.ts`
5. Add to `AVAILABLE_TOOLS` in `agent.types.ts`
6. Update this documentation

---

## Security

### API Keys

- ✅ Stored in `.env.local` (server-side only)
- ✅ Never exposed to client
- ✅ Admin-only for global credentials
- ✅ Per-user for OAuth tokens (encrypted)

### Rate Limiting

- ⚠️ TODO: Implement rate limiting per tool
- ⚠️ TODO: Track usage per user
- ⚠️ TODO: Set quotas

### Logging

All tool executions are logged with:
- Tool ID
- Parameters (sanitized)
- Success/failure
- Execution time
- Error details

---

## Testing

### Manual Testing

Create a test agent:
1. Go to `/app/agents/create`
2. Fill in basic info
3. Enable "Web Search" tool
4. Save agent

### Unit Testing

```typescript
describe('Web Search Tool', () => {
  it('should search successfully', async () => {
    const result = await webSearchTool.execute({
      query: 'test query',
      maxResults: 3,
    });
    expect(result.success).toBe(true);
  });
});
```

---

## Troubleshooting

### Web Search Not Working

1. Check `TAVILY_API_KEY` is set in `.env.local`
2. Verify API key is valid at [tavily.com](https://tavily.com)
3. Check server logs for error details
4. Ensure no firewall blocking `api.tavily.com`

### Tool Not Showing in Agent Builder

1. Verify tool is registered in `registry.ts`
2. Check `AVAILABLE_TOOLS` in `agent.types.ts`
3. Ensure tool is not marked as `comingSoon: true`

---

## Roadmap

### Sprint 2 - Week 3 ✅
- ✅ Web Search tool
- ✅ Tool registry architecture
- ✅ Error handling
- ✅ Logging

### Sprint 2 - Week 4
- 🔜 Email tool (send only)
- 🔜 OpenAI function calling integration
- 🔜 Test UI for single agent

### Sprint 3 - Week 6
- 🔜 Calendar tool
- 🔜 Database operations tool
- 🔜 OAuth per-user setup

