/**
 * Test Workflow Engine
 * Script to test workflow engine execution
 */

import { config } from 'dotenv';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeWorkflow } from '@/lib/workflows/engine';
import { createLoggersFromClient } from '@/lib/workflows/engine-utils';
import type { Workflow, WorkflowStep } from '@/types/workflow.types';
import type { Agent } from '@/types/agent.types';

// Create admin client once
const supabase = createAdminClient();

// Load environment variables
config({ path: '.env.local' });

interface TestContext {
  userId: string;
  workflowId?: string;
  agentIds: string[];
}

/**
 * Create test agents if they don't exist
 */
async function setupTestAgents(userId: string): Promise<string[]> {
  console.log('📋 Setting up test agents...\n');

  const supabase = createAdminClient();
  const agentIds: string[] = [];

  // Research Agent (web_search tool)
  const researchAgent = await createTestAgentIfNotExists(userId, {
    name: 'Test Research Agent',
    description: 'Research agent for testing workflow engine',
    role: 'You are a research assistant. Search the web for information and provide detailed results.',
    model: 'gpt-4o-mini',
    tools_enabled: ['web_search'],
  });

  if (researchAgent) {
    agentIds.push(researchAgent);
    console.log('✅ Research Agent created/found:', researchAgent);
  }

  // Report Agent (no tools, just summarizes)
  const reportAgent = await createTestAgentIfNotExists(userId, {
    name: 'Test Report Agent',
    description: 'Report agent for testing workflow engine',
    role: 'You are a report writer. Summarize and structure information into clear reports.',
    model: 'gpt-4o-mini',
    tools_enabled: [],
  });

  if (reportAgent) {
    agentIds.push(reportAgent);
    console.log('✅ Report Agent created/found:', reportAgent);
  }

  return agentIds;
}

async function createTestAgentIfNotExists(
  userId: string,
  agentData: {
    name: string;
    description: string;
    role: string;
    model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
    tools_enabled: string[];
  }
): Promise<string | null> {

  // Check if agent exists
  const { data: existing } = await supabase
    .from('agents')
    .select('id')
    .eq('owner_id', userId)
    .eq('name', agentData.name)
    .single();

  if (existing) {
    console.log(`   Agent "${agentData.name}" already exists: ${existing.id}`);
    return existing.id;
  }

  // Create agent
  const { data, error } = await supabase
    .from('agents')
    .insert({
      owner_id: userId,
      name: agentData.name,
      description: agentData.description,
      role: agentData.role,
      model: agentData.model,
      temperature: 0.7,
      max_tokens: 2000,
      tools_enabled: agentData.tools_enabled,
      config: {},
      status: 'active',
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error(`❌ Error creating agent ${agentData.name}:`, error);
    return null;
  }

  console.log(`   Created agent "${agentData.name}": ${data.id}`);
  return data.id;
}

/**
 * Create test workflow if it doesn't exist
 */
async function setupTestWorkflow(
  userId: string,
  agentIds: string[]
): Promise<string | null> {
  console.log('\n📋 Setting up test workflow...\n');

  if (agentIds.length < 2) {
    console.error('❌ Need at least 2 agents to create workflow');
    return null;
  }

  // Check if workflow exists
  const { data: existing } = await supabase
    .from('workflows')
    .select('id')
    .eq('owner_id', userId)
    .eq('name', 'Test Workflow Engine')
    .single();

  if (existing) {
    console.log('✅ Test workflow found:', existing.id);
    return existing.id;
  }

  // Create workflow steps
  const steps: WorkflowStep[] = [
    {
      id: 'step-1',
      agentId: agentIds[0],
      name: 'Research Step',
    },
    {
      id: 'step-2',
      agentId: agentIds[1],
      name: 'Report Step',
    },
  ];

  // Create workflow
  const { data, error } = await supabase
    .from('workflows')
    .insert({
      owner_id: userId,
      name: 'Test Workflow Engine',
      description: 'Test workflow for workflow engine validation',
      graph: {
        steps,
        edges: [],
        triggers: {
          manual: true,
        },
      },
      status: 'active',
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('❌ Error creating workflow:', error);
    return null;
  }

  console.log('✅ Test workflow created:', data.id);
  return data.id;
}

/**
 * Get agent using admin client (for testing)
 */
async function getAgentForTest(agentId: string): Promise<{ data: Agent | null; error: string | null }> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message || 'Agent not found' };
  }

  return { data: data as Agent, error: null };
}

/**
 * Test workflow execution
 */
async function testWorkflowExecution(workflowId: string, userId: string) {
  console.log('\n🚀 Testing workflow execution...\n');

  // Get workflow directly from DB
  const { data: workflowData, error: wfError } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', workflowId)
    .single();

  if (wfError || !workflowData) {
    console.error('❌ Error getting workflow:', wfError);
    return;
  }

  const workflow = workflowData as Workflow;
  console.log('📄 Workflow:', workflow.name);
  console.log(`   Steps: ${workflow.graph.steps.length}`);
  console.log(`   Status: ${workflow.status}\n`);

  // Test input
  const testInput = 'What are the latest developments in AI and machine learning? Provide a summary.';

  console.log('📥 Test Input:', testInput);
  console.log('\n⏳ Executing workflow...\n');

  try {
    // Create loggers using admin client (bypasses RLS for testing)
    const loggers = createLoggersFromClient(supabase);

    // Execute workflow with custom getAgent function and loggers (uses admin client)
    const result = await executeWorkflow(workflow, testInput, userId, getAgentForTest, loggers);

    console.log('📊 Execution Result:');
    console.log('   Success:', result.success);
    console.log('   Workflow Run ID:', result.workflowRunId);
    console.log('   Total Time:', result.totalExecutionTime, 'ms');
    console.log('   Agent Runs:', result.agentRuns.length);

    if (result.error) {
      console.log('   ❌ Error:', result.error);
    }

    if (result.output) {
      console.log('\n📤 Output:');
      console.log('   ', result.output.substring(0, 200) + '...\n');
    }

    // Show agent run details
    console.log('\n📋 Agent Runs Details:');
    result.agentRuns.forEach((run) => {
      console.log(`   Step ${run.stepOrder}:`);
      console.log(`     Agent ID: ${run.agentId}`);
      console.log(`     Status: ${run.status}`);
      if (run.output) {
        console.log(`     Output: ${run.output.substring(0, 100)}...`);
      }
      if (run.error) {
        console.log(`     Error: ${run.error}`);
      }
    });

    console.log('\n✅ Workflow execution test completed!\n');

    // Verify DB records
    await verifyDatabaseRecords(result.workflowRunId);

    return result.success;
  } catch (error) {
    console.error('❌ Workflow execution failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Stack:', error.stack);
    }
    return false;
  }
}

/**
 * Verify database records were created
 */
async function verifyDatabaseRecords(workflowRunId: string) {
  console.log('\n🔍 Verifying database records...\n');

  // Check workflow_run
  const { data: workflowRun, error: wrError } = await supabase
    .from('workflow_runs')
    .select('*')
    .eq('id', workflowRunId)
    .single();

  if (wrError || !workflowRun) {
    console.error('❌ Workflow run not found:', wrError);
    return;
  }

  console.log('✅ Workflow Run:');
  console.log('   ID:', workflowRun.id);
  console.log('   Status:', workflowRun.status);
  console.log('   Started:', workflowRun.started_at);
  console.log('   Finished:', workflowRun.finished_at);

  // Check agent_runs
  const { data: agentRuns, error: arError } = await supabase
    .from('agent_runs')
    .select('*')
    .eq('workflow_run_id', workflowRunId)
    .order('step_order');

  if (arError) {
    console.error('❌ Error fetching agent runs:', arError);
    return;
  }

  console.log(`\n✅ Agent Runs: ${agentRuns?.length || 0}`);
  agentRuns?.forEach((run) => {
    console.log(`   Step ${run.step_order}: ${run.status}`);
  });

  // Check tool_invocations
  if (agentRuns && agentRuns.length > 0) {
    const agentRunIds = agentRuns.map((r) => r.id);
    const { data: toolInvocations, error: tiError } = await supabase
      .from('tool_invocations')
      .select('*')
      .in('agent_run_id', agentRunIds);

    if (!tiError) {
      console.log(`\n✅ Tool Invocations: ${toolInvocations?.length || 0}`);
      toolInvocations?.forEach((inv) => {
        console.log(`   Tool: ${inv.tool}, Status: ${inv.status}`);
      });
    }
  }

  console.log('\n✅ Database verification completed!\n');
}

/**
 * Main test function
 */
async function main() {
  console.log('🧪 Testing Workflow Engine\n');
  console.log('=' .repeat(60) + '\n');

  try {
    // Check OpenAI configuration
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      console.error('❌ OPENAI_API_KEY not configured!');
      console.error('   Please set OPENAI_API_KEY in .env.local\n');
      process.exit(1);
    }
    console.log('✅ OpenAI API key configured\n');

    // Check Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase configuration missing!');
      console.error('   Please check .env.local\n');
      process.exit(1);
    }
    console.log('✅ Supabase configuration OK\n');

    // Get or create test user (using admin client)
    // For testing, we'll use the first user or create a test user
    const { data: users } = await supabase.auth.admin.listUsers();

    if (!users || users.users.length === 0) {
      console.error('❌ No users found in database!');
      console.error('   Please create a user first via signup\n');
      process.exit(1);
    }

    const testUser = users.users[0];
    const userId = testUser.id;

    console.log('👤 Using test user:', testUser.email || userId);
    console.log('   User ID:', userId + '\n');

    // Setup test data
    const agentIds = await setupTestAgents(userId);
    if (agentIds.length < 2) {
      console.error('❌ Failed to create test agents\n');
      process.exit(1);
    }

    const workflowId = await setupTestWorkflow(userId, agentIds);
    if (!workflowId) {
      console.error('❌ Failed to create test workflow\n');
      process.exit(1);
    }

    // Test workflow execution
    const success = await testWorkflowExecution(workflowId, userId);

    console.log('=' .repeat(60));
    if (success) {
      console.log('\n🎉 All tests passed!\n');
      process.exit(0);
    } else {
      console.log('\n❌ Tests failed\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run tests
main();

