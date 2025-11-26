/**
 * Agent Detail Content Component
 * Displays agent configuration and tools
 * Following SRP: Only handles content rendering
 */

import type { Agent } from '@/types/agent.types';
import { AgentConfiguration } from './agent-configuration';
import { AgentTools } from './agent-tools';
import { AgentRole } from './agent-role';

interface AgentDetailContentProps {
  agent: Agent;
}

export const AgentDetailContent = ({ agent }: AgentDetailContentProps) => {
  return (
    <div className="space-y-6">
      <AgentRole role={agent.role} />
      <AgentConfiguration agent={agent} />
      <AgentTools tools={agent.tools_enabled} />
    </div>
  );
};

