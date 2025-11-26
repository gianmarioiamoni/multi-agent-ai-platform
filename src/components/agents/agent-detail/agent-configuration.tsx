/**
 * Agent Configuration Component
 * Displays agent model and parameters
 * Following SRP: Only handles configuration rendering
 */

import type { Agent } from '@/types/agent.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AVAILABLE_MODELS } from '@/types/agent.types';

interface AgentConfigurationProps {
  agent: Agent;
}

export const AgentConfiguration = ({ agent }: AgentConfigurationProps) => {
  const modelInfo = AVAILABLE_MODELS.find((m) => m.id === agent.model);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Model</p>
            <p className="text-sm font-medium">{modelInfo?.name || agent.model}</p>
            {modelInfo?.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {modelInfo.description}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Temperature</p>
            <p className="text-sm font-medium">{agent.temperature}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Max Tokens</p>
            <p className="text-sm font-medium">{agent.max_tokens}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

