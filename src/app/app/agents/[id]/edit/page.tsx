/**
 * Edit Agent Page
 * Page for editing an existing AI agent
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAgent } from '@/lib/agents/actions';
import { getDefaultModel } from '@/lib/settings/utils';
import { AgentBuilder } from '@/components/agents/agent-builder';

interface EditAgentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditAgentPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: agent } = await getAgent(id);
  
  return {
    title: agent ? `Edit ${agent.name} - Agent` : 'Agent Not Found',
    description: 'Edit your AI agent configuration',
  };
}

export default async function EditAgentPage({ params }: EditAgentPageProps) {
  const { id } = await params;
  const { data: agent, error } = await getAgent(id);
  const defaultModel = await getDefaultModel();

  if (error || !agent) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit AI Agent</h1>
        <p className="text-muted-foreground mt-1">
          Modify your agent configuration
        </p>
      </div>

      <AgentBuilder agentId={agent.id} defaultModel={defaultModel} />
    </div>
  );
}

