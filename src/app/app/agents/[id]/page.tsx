/**
 * Agent Detail Page
 * Displays detailed information about a single agent
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAgent } from '@/lib/agents/actions';
import { AgentDetailHeader } from '@/components/agents/agent-detail/agent-detail-header';
import { AgentDetailContent } from '@/components/agents/agent-detail/agent-detail-content';

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: agent } = await getAgent(id);
  
  return {
    title: agent ? `${agent.name} - Agent` : 'Agent Not Found',
    description: agent?.description || 'Agent details',
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = await params;
  const { data: agent, error } = await getAgent(id);

  if (error || !agent) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AgentDetailHeader agent={agent} />
      <AgentDetailContent agent={agent} />
    </div>
  );
}

