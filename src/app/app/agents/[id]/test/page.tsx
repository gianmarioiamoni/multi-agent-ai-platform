/**
 * Agent Test Page
 * Page for testing a single agent
 * Server Component
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';
import { getAgent } from '@/lib/agents/actions';
import { AgentTestClient } from '@/components/agents/agent-test/agent-test-client';
import { BreadcrumbsLabelUpdater } from '@/components/breadcrumbs/breadcrumbs-provider';

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
  const { data: agent, error: agentError } = await getAgent(id);

  if (agentError || !agent) {
    redirect('/app/agents');
  }

  // Validate ownership
  if (agent.owner_id !== user.id) {
    redirect('/app/agents');
  }

  return (
    <div className="container mx-auto py-8">
      {/* Update breadcrumbs with agent name */}
      <BreadcrumbsLabelUpdater customLabels={{ 
        [`/app/agents/${id}`]: agent.name,
        [`/app/agents/${id}/test`]: 'Test Agent'
      }} />
      <AgentTestClient agentId={agent.id} agentName={agent.name} />
    </div>
  );
}

