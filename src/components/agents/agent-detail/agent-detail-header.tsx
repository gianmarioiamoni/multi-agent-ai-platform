/**
 * Agent Detail Header Component
 * Displays agent header with title, status, and actions
 * Following SRP: Only handles header rendering
 * Server Component - static content with Link only
 */

import Link from 'next/link';
import type { Agent } from '@/types/agent.types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format';
import { AgentDetailActions } from './agent-detail-actions';
import { AgentStatusBadge } from './agent-status-badge';

interface AgentDetailHeaderProps {
  agent: Agent;
}

export const AgentDetailHeader = ({ agent }: AgentDetailHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/app/agents">
                <Button variant="ghost" size="sm">
                  ← Back
                </Button>
              </Link>
              <CardTitle className="text-2xl">{agent.name}</CardTitle>
              <AgentStatusBadge status={agent.status} />
            </div>
            {agent.description ? <CardDescription className="text-base mt-2">
                {agent.description}
              </CardDescription> : null}
          </div>
          <AgentDetailActions agent={agent} />
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Created:</span> {formatDate(agent.created_at)}
          </div>
          <div>
            <span className="font-medium">Updated:</span> {formatDate(agent.updated_at)}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

