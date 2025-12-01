/**
 * Seed Demo Data Script
 * Creates demo agents and workflows for the demo user
 * Usage: pnpm seed:demo
 * 
 * Requirements:
 * - Demo user must exist with email: multiagentdemouser@gmail.com
 * - Demo user must be marked as demo (is_demo = true in profiles)
 */

/* eslint-disable no-console */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import type { CreateAgentInput } from '@/types/agent.types';
import type { CreateWorkflowInput } from '@/types/workflow.types';

// Load environment variables
config({ path: '.env.local' });

const DEMO_USER_EMAIL = 'multiagentdemouser@gmail.com';

/**
 * Creates Supabase admin client with service role
 */
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase configuration. Please set:\n' +
      '  - NEXT_PUBLIC_SUPABASE_URL\n' +
      '  - SUPABASE_SERVICE_ROLE_KEY\n' +
      'in your .env.local file'
    );
  }

  const client = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return client;
}

/**
 * Find demo user by email
 */
async function findDemoUser(supabase: ReturnType<typeof createAdminClient>) {
  console.log(`🔍 Looking for demo user: ${DEMO_USER_EMAIL}...`);

  // Get all users
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const demoUser = users.find(u => u.email === DEMO_USER_EMAIL);

  if (!demoUser) {
    throw new Error(
      `Demo user not found with email: ${DEMO_USER_EMAIL}\n` +
      'Please create the user first and set is_demo = true in profiles table.'
    );
  }

  // Verify demo flag
  // Workaround: Type inference issue - cast needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, error: profileError } = await (supabase as any)
    .from('profiles')
    .select('is_demo')
    .eq('user_id', demoUser.id)
    .single() as { data: { is_demo?: boolean } | null; error: unknown };

  if (profileError || !profile) {
    throw new Error(`Failed to fetch profile for demo user: ${profileError || 'No profile found'}`);
  }

  if (profile.is_demo !== true) {
    console.warn(`⚠️  Warning: User ${DEMO_USER_EMAIL} exists but is_demo is not set to true.`);
    console.warn('   Setting is_demo = true...');
    
    // Workaround: Type inference issue - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({ is_demo: true })
      .eq('user_id', demoUser.id) as { error: unknown };

    if (updateError) {
      throw new Error(`Failed to set is_demo flag: ${updateError}`);
    }
  }

  console.log(`   ✅ Demo user found: ${demoUser.id}`);
  return demoUser.id;
}

/**
 * Creates a demo agent
 */
async function createDemoAgent(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  agentData: CreateAgentInput
): Promise<string> {
  const agentPayload: Database['public']['Tables']['agents']['Insert'] = {
    owner_id: userId,
    name: agentData.name,
    description: agentData.description || null,
    role: agentData.role,
    model: agentData.model,
    temperature: agentData.temperature ?? 0.7,
    max_tokens: agentData.max_tokens ?? 2000,
    tools_enabled: (agentData.tools_enabled || []) as string[],
    config: (agentData.config || {}) as Database['public']['Tables']['agents']['Insert']['config'],
    status: 'active',
  };

  // Workaround: Type inference issue - cast needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('agents')
    .insert(agentPayload)
    .select('id')
    .single() as { data: { id: string } | null; error: unknown };

  if (error || !data) {
    throw new Error(`Failed to create agent "${agentData.name}": ${error || 'No data returned'}`);
  }

  return data.id;
}

/**
 * Creates a demo workflow
 */
async function createDemoWorkflow(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  workflowData: CreateWorkflowInput
): Promise<string> {
  const workflowPayload: Database['public']['Tables']['workflows']['Insert'] = {
    owner_id: userId,
    name: workflowData.name,
    description: workflowData.description || null,
    graph: (workflowData.graph || {
      steps: [],
      edges: [],
      triggers: { manual: true },
    }) as Database['public']['Tables']['workflows']['Insert']['graph'],
    status: 'active',
  };

  // Workaround: Type inference issue - cast needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('workflows')
    .insert(workflowPayload)
    .select('id')
    .single() as { data: { id: string } | null; error: unknown };

  if (error || !data) {
    throw new Error(`Failed to create workflow "${workflowData.name}": ${error || 'No data returned'}`);
  }

  return data.id;
}

/**
 * Main seed function
 */
async function seedDemoData() {
  console.log('🌱 Starting demo data seed process...\n');

  try {
    // Create admin client
    console.log('1️⃣ Connecting to Supabase...');
    const supabase = createAdminClient();
    console.log('   ✅ Connected\n');

    // Find demo user
    console.log('2️⃣ Finding demo user...');
    const userId = await findDemoUser(supabase);
    console.log('   ✅ Demo user ID:', userId, '\n');

    // Check if agents already exist for this user
    console.log('3️⃣ Checking existing demo agents...');
    // Workaround: Type inference issue - cast needed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingAgents, error: agentsError } = await (supabase as any)
      .from('agents')
      .select('id, name')
      .eq('owner_id', userId) as { data: Array<{ id: string; name: string }> | null; error: unknown };

    if (agentsError) {
      throw new Error(`Failed to check existing agents: ${agentsError}`);
    }

    if (existingAgents && existingAgents.length > 0) {
      console.log(`   ⚠️  Found ${existingAgents.length} existing agent(s):`);
      existingAgents.forEach(agent => console.log(`      - ${agent.name}`));
      console.log('   ℹ️  Skipping agent creation. Delete existing agents to recreate.\n');
      
      // Still check workflows
      console.log('4️⃣ Checking existing demo workflows...');
      // Workaround: Type inference issue - cast needed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingWorkflows, error: workflowsError } = await (supabase as any)
        .from('workflows')
        .select('id, name')
        .eq('owner_id', userId) as { data: Array<{ id: string; name: string }> | null; error: unknown };

      if (workflowsError) {
        throw new Error(`Failed to check existing workflows: ${workflowsError}`);
      }

      if (existingWorkflows && existingWorkflows.length > 0) {
        console.log(`   ⚠️  Found ${existingWorkflows.length} existing workflow(s):`);
        existingWorkflows.forEach(workflow => console.log(`      - ${workflow.name}`));
        console.log('   ℹ️  Skipping workflow creation. Delete existing workflows to recreate.\n');
        console.log('✅ Seed process completed (existing data found).');
        return;
      }

      // If we have agents but no workflows, we need agent IDs to create workflows
      if (existingAgents.length >= 5) {
        // Assume we have all agents, create workflows
        const agentMap: Record<string, string> = {};
        existingAgents.forEach(agent => {
          // Try to match by name (this is a bit fragile, but works for demo)
          const nameLower = agent.name.toLowerCase();
          if (nameLower.includes('research')) {agentMap['research'] = agent.id;}
          if (nameLower.includes('report')) {agentMap['report'] = agent.id;}
          if (nameLower.includes('email')) {agentMap['email'] = agent.id;}
          if (nameLower.includes('meeting')) {agentMap['meeting'] = agent.id;}
          if (nameLower.includes('operations')) {agentMap['operations'] = agent.id;}
        });

        // Create workflows with existing agents
        await createWorkflows(supabase, userId, agentMap);
        console.log('✅ Seed process completed (workflows created with existing agents).');
        return;
      }
    }

    // Create demo agents
    console.log('4️⃣ Creating demo agents...\n');

    const agents: Array<CreateAgentInput & { id?: string }> = [
      {
        name: 'Research Agent',
        description: 'Specialized in web research and competitor analysis. Uses web search to gather real-time information.',
        role: 'You are a research specialist. Your task is to search the web for information, analyze competitor data, and gather relevant insights. Always provide comprehensive and accurate research results.',
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 3000,
        tools_enabled: ['web_search'],
      },
      {
        name: 'Report Agent',
        description: 'Expert at generating structured reports and summaries. Synthesizes information into clear, actionable documents.',
        role: 'You are a report generation specialist. Your task is to synthesize information from multiple sources into well-structured, clear, and actionable reports. Focus on clarity, organization, and key insights.',
        model: 'gpt-4o-mini',
        temperature: 0.5,
        max_tokens: 4000,
        tools_enabled: [], // No tools - pure analysis and reporting
      },
      {
        name: 'Email Agent',
        description: 'Handles email communications professionally. Sends reports, reminders, and notifications.',
        role: 'You are an email communication specialist. Your task is to craft professional, clear, and effective emails. Always be concise, polite, and include all necessary information.',
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 2000,
        tools_enabled: ['email'],
      },
      {
        name: 'Meeting Preparation Agent',
        description: 'Prepares meeting briefings by gathering calendar information and researching attendees.',
        role: 'You are a meeting preparation specialist. Your task is to gather information about upcoming meetings, research attendees and companies, and create comprehensive briefing documents.',
        model: 'gpt-4o-mini',
        temperature: 0.4,
        max_tokens: 3000,
        tools_enabled: ['calendar', 'web_search', 'db_ops'],
      },
      {
        name: 'Operations Agent',
        description: 'Monitors operations, tracks tasks, and sends automated reminders. Manages follow-ups and notifications.',
        role: 'You are an operations specialist. Your task is to monitor operational tasks, track open activities, and send timely reminders. Be proactive and ensure nothing falls through the cracks.',
        model: 'gpt-4o-mini',
        temperature: 0.5,
        max_tokens: 2000,
        tools_enabled: ['db_ops', 'email'],
      },
    ];

    const agentIds: Record<string, string> = {};

    for (const agent of agents) {
      try {
        const agentId = await createDemoAgent(supabase, userId, agent);
        agentIds[agent.name.toLowerCase().replace(/\s+/g, '_')] = agentId;
        console.log(`   ✅ Created agent: ${agent.name} (${agentId})`);
      } catch (error) {
        console.error(`   ❌ Failed to create agent "${agent.name}":`, error);
        throw error;
      }
    }

    console.log('\n');

    // Create demo workflows
    console.log('5️⃣ Creating demo workflows...\n');

    await createWorkflows(supabase, userId, agentIds);

    console.log('\n✅ Demo data seed completed successfully!');
    console.log('\nCreated:');
    console.log(`   - ${agents.length} agents`);
    console.log(`   - 3 workflows`);
    console.log('\nYou can now log in as the demo user to see the pre-configured workflows.');

  } catch (error) {
    console.error('\n❌ Seed failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if (error.stack) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    } else {
      console.error('   Unknown error occurred');
    }
    process.exit(1);
  }
}

/**
 * Creates demo workflows
 */
async function createWorkflows(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  agentIds: Record<string, string>
) {
  // Helper to get agent ID by partial name match
  const getAgentId = (namePattern: string): string => {
    const key = Object.keys(agentIds).find(k => k.includes(namePattern.toLowerCase()));
    if (!key || !agentIds[key]) {
      throw new Error(`Agent not found for pattern: ${namePattern}. Available: ${Object.keys(agentIds).join(', ')}`);
    }
    return agentIds[key];
  };

  // 1. Weekly Report Workflow
  const researchAgentId = getAgentId('research');
  const reportAgentId = getAgentId('report');
  const emailAgentId = getAgentId('email');

  const weeklyReportWorkflow: CreateWorkflowInput = {
    name: 'Weekly Report Generator',
    description: 'Automatically generates weekly competitor analysis reports. Researches competitors, creates structured report, and emails it to the manager.',
    graph: {
      steps: [
        {
          id: 'step-1',
          agentId: researchAgentId,
          name: 'Research Competitors',
        },
        {
          id: 'step-2',
          agentId: reportAgentId,
          name: 'Generate Report',
        },
        {
          id: 'step-3',
          agentId: emailAgentId,
          name: 'Send Report via Email',
        },
      ],
      edges: [
        { id: 'edge-1', from: 'step-1', to: 'step-2' },
        { id: 'edge-2', from: 'step-2', to: 'step-3' },
      ],
      triggers: {
        manual: true,
      },
    },
  };

  try {
    const workflowId1 = await createDemoWorkflow(supabase, userId, weeklyReportWorkflow);
    console.log(`   ✅ Created workflow: ${weeklyReportWorkflow.name} (${workflowId1})`);
  } catch (error) {
    console.error(`   ❌ Failed to create workflow "${weeklyReportWorkflow.name}":`, error);
    throw error;
  }

  // 2. Meeting Preparation Workflow
  const meetingAgentId = getAgentId('meeting');

  const meetingPrepWorkflow: CreateWorkflowInput = {
    name: 'Meeting Preparation Assistant',
    description: 'Prepares comprehensive briefings for upcoming meetings. Checks calendar, researches attendees and companies, and generates briefing document.',
    graph: {
      steps: [
        {
          id: 'step-1',
          agentId: meetingAgentId,
          name: 'Gather Meeting Info & Research',
        },
        {
          id: 'step-2',
          agentId: reportAgentId,
          name: 'Generate Meeting Briefing',
        },
      ],
      edges: [
        { id: 'edge-1', from: 'step-1', to: 'step-2' },
      ],
      triggers: {
        manual: true,
      },
    },
  };

  try {
    const workflowId2 = await createDemoWorkflow(supabase, userId, meetingPrepWorkflow);
    console.log(`   ✅ Created workflow: ${meetingPrepWorkflow.name} (${workflowId2})`);
  } catch (error) {
    console.error(`   ❌ Failed to create workflow "${meetingPrepWorkflow.name}":`, error);
    throw error;
  }

  // 3. Operations Follow-up Workflow
  const operationsAgentId = getAgentId('operations');

  const operationsFollowupWorkflow: CreateWorkflowInput = {
    name: 'Operations Follow-up Automation',
    description: 'Monitors open tasks and sends automated reminder emails. Keeps track of operational activities and ensures timely follow-ups.',
    graph: {
      steps: [
        {
          id: 'step-1',
          agentId: operationsAgentId,
          name: 'Check Open Tasks & Send Reminders',
        },
      ],
      edges: [],
      triggers: {
        manual: true,
      },
    },
  };

  try {
    const workflowId3 = await createDemoWorkflow(supabase, userId, operationsFollowupWorkflow);
    console.log(`   ✅ Created workflow: ${operationsFollowupWorkflow.name} (${workflowId3})`);
  } catch (error) {
    console.error(`   ❌ Failed to create workflow "${operationsFollowupWorkflow.name}":`, error);
    throw error;
  }
}

// Run seed
seedDemoData();

