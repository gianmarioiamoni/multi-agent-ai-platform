/**
 * Agent Card Header Component
 * Header with title, description, and status badge
 * Following SRP: Only handles header rendering
 */

'use client';

import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AgentCardHeaderProps {
  name: string;
  description: string | null;
  status: string;
  statusColor: string;
}

export const AgentCardHeader = ({
  name,
  description,
  status,
  statusColor,
}: AgentCardHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          {description && (
            <CardDescription className="mt-2 line-clamp-2">
              {description}
            </CardDescription>
          )}
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-md border ${statusColor}`}>
          {status}
        </span>
      </div>
    </CardHeader>
  );
};

