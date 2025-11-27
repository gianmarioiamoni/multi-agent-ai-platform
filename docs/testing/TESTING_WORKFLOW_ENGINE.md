# Testing Workflow Engine

This guide explains how to test the workflow engine implementation.

## Prerequisites

1. **Environment Variables**: Ensure `.env.local` is configured with:
   - `OPENAI_API_KEY` - OpenAI API key for agent execution
   - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

2. **Database Migration**: Migration 004 must be applied:
   - `workflow_runs` table
   - `agent_runs` table
   - `tool_invocations` table

   See `scripts/apply-migration-004.md` for instructions.

3. **At least one user**: You need at least one user in the database (created via signup).

## Running the Test

```bash
pnpm test:workflow
```

## What the Test Does

1. **Validates Configuration**:
   - Checks OpenAI API key is set
   - Checks Supabase configuration

2. **Sets Up Test Data**:
   - Uses the first user from database (or you can modify to use a specific user)
   - Creates test agents if they don't exist:
     - Research Agent (with web_search tool)
     - Report Agent (no tools, for summarization)
   - Creates test workflow if it doesn't exist:
     - 2-step sequential workflow
     - Step 1: Research Agent
     - Step 2: Report Agent

3. **Executes Workflow**:
   - Runs the workflow with test input
   - Executes agents sequentially
   - Passes output from step 1 to step 2
   - Logs all tool invocations

4. **Verifies Results**:
   - Checks workflow run was created
   - Checks agent runs were created
   - Checks tool invocations were logged
   - Displays execution statistics

## Expected Output

```
🧪 Testing Workflow Engine
============================================================

✅ OpenAI API key configured
✅ Supabase configuration OK
👤 Using test user: your-email@example.com
   User ID: xxx-xxx-xxx

📋 Setting up test agents...
✅ Research Agent created/found: xxx
✅ Report Agent created/found: xxx

📋 Setting up test workflow...
✅ Test workflow created: xxx

🚀 Testing workflow execution...

📄 Workflow: Test Workflow Engine
   Steps: 2
   Status: active

📥 Test Input: What are the latest developments in AI...

⏳ Executing workflow...

[Workflow Engine] Starting workflow execution: ...
[Workflow Engine] Executing step 1/2: ...
[Orchestrator] Starting agent execution: ...

📊 Execution Result:
   Success: true
   Workflow Run ID: xxx
   Total Time: 5000ms
   Agent Runs: 2

📋 Agent Runs Details:
   Step 1:
     Agent ID: xxx
     Status: completed
     Output: ...
   Step 2:
     Agent ID: xxx
     Status: completed
     Output: ...

✅ Workflow execution test completed!

🔍 Verifying database records...
✅ Workflow Run: ...
✅ Agent Runs: 2
✅ Tool Invocations: 1

============================================================
🎉 All tests passed!
```

## Troubleshooting

### "OPENAI_API_KEY not configured"
- Add `OPENAI_API_KEY=sk-...` to `.env.local`

### "No users found in database"
- Create a user via signup at `/auth/signup`
- Or modify the script to use a specific user ID

### "Migration 004 not applied"
- Apply migration 004 using Supabase Dashboard or CLI
- See `scripts/apply-migration-004.md`

### "Agent not found" errors
- The script should auto-create test agents
- Check that agents table exists and RLS allows reads

### Workflow execution fails
- Check OpenAI API key is valid
- Check that agents are active (status = 'active')
- Check that tools are configured (TAVILY_API_KEY for web_search)
- Check server logs for detailed error messages

## Test Coverage

The test script verifies:
- ✅ Workflow engine can execute sequential steps
- ✅ Output is passed between steps correctly
- ✅ Database logging works (workflow_runs, agent_runs, tool_invocations)
- ✅ Status tracking works (pending → running → completed/failed)
- ✅ Error handling works (failed steps stop workflow)
- ✅ Tool invocations are logged correctly

## Manual Testing

You can also test the workflow engine manually:

1. Create agents via UI (`/app/agents/create`)
2. Create workflow via UI (`/app/workflows/create`) - coming in Sprint 3 Week 5
3. Execute workflow via API or UI

---

**Related**:
- [Workflow Engine Documentation](./WORKFLOW_ENGINE.md) (coming soon)
- [Apply Migration 004](../scripts/apply-migration-004.md)

