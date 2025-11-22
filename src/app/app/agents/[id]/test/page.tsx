/**
 * Agent Test Page
 * Page for testing a single agent
 * Server Component
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';
import { getAgent } from '@/lib/agents/actions';
import { AgentTestClient } from '@/components/agents/agent-test/agent-test-client';

interface AgentTestPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentTestPage({ params }: AgentTestPageProps) {
  // Require authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Get agent ID from params
  const { id } = await params;

  // Get agent
  const agent = await getAgent(id);

  if (!agent) {
    redirect('/app/agents');
  }

  // Validate ownership
  if (agent.owner_id !== user.id) {
    redirect('/app/agents');
  }

  return (
    <div className="container mx-auto py-8">
      <AgentTestClient agentId={agent.id} agentName={agent.name} />
    </div>
  );
}

