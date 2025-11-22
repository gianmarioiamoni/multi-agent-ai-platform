/**
 * Agent Card Component
 * Displays a single agent in card format
 * Following SRP: Only handles agent card rendering
 */

'use client';

import type { AgentListItem } from '@/types/agent.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AVAILABLE_MODELS, AVAILABLE_TOOLS } from '@/types/agent.types';
import { formatDate } from '@/utils/format';

interface AgentCardProps {
  agent: AgentListItem;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const modelInfo = AVAILABLE_MODELS.find((m) => m.id === agent.model);
  const enabledTools = agent.tools_enabled.map((toolId) =>
    AVAILABLE_TOOLS.find((t) => t.id === toolId)
  ).filter(Boolean);

  const statusColor = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    archived: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  }[agent.status];

  return (
    <Card className="h-full hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {agent.name}
              </CardTitle>
              {agent.description && (
                <CardDescription className="mt-2 line-clamp-2">
                  {agent.description}
                </CardDescription>
              )}
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-md border ${statusColor}`}
            >
              {agent.status}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Model */}
            <div className="flex items-center text-sm">
              <svg
                className="w-4 h-4 mr-2 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-muted-foreground">
                {modelInfo?.name || agent.model}
              </span>
            </div>

            {/* Tools */}
            {enabledTools.length > 0 && (
              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Tools
                </div>
                <div className="flex flex-wrap gap-1">
                  {enabledTools.map((tool) => (
                    <span
                      key={tool!.id}
                      className="px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-md"
                    >
                      {tool!.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Created date */}
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              Created {formatDate(agent.created_at)}
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

