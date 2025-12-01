/**
 * Create Agent Page
 * Page for creating a new AI agent
 */

import { AgentBuilder } from '@/components/agents/agent-builder';
import { getDefaultModel } from '@/lib/settings/utils';

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

export default async function CreateAgentPage() {
  const defaultModel = await getDefaultModel();

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create AI Agent</h1>
        <p className="text-muted-foreground mt-1">
          Configure your AI agent with a custom role, model, and tools
        </p>
      </div>

      <AgentBuilder defaultModel={defaultModel} />
    </div>
  );
}

