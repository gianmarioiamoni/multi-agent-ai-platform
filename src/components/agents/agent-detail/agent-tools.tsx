/**
 * Agent Tools Component
 * Displays enabled tools for the agent
 * Following SRP: Only handles tools rendering
 */

import type { ToolId } from '@/types/agent.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AVAILABLE_TOOLS } from '@/types/agent.types';

interface AgentToolsProps {
  tools: ToolId[];
}

export const AgentTools = ({ tools }: AgentToolsProps) => {
  const enabledTools = tools.map((toolId) =>
    AVAILABLE_TOOLS.find((t) => t.id === toolId)
  ).filter(Boolean);

  if (enabledTools.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No tools enabled.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enabled Tools ({enabledTools.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {enabledTools.map((tool) => (
            <span
              key={tool!.id}
              className="px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20 rounded-md"
            >
              {tool!.name}
            </span>
          ))}
        </div>
        {enabledTools.length > 0 ? <div className="mt-4 space-y-2">
            {enabledTools.map((tool) => (
              <div key={tool!.id} className="text-sm">
                <p className="font-medium">{tool!.name}</p>
                <p className="text-muted-foreground">{tool!.description}</p>
              </div>
            ))}
          </div> : null}
      </CardContent>
    </Card>
  );
};

