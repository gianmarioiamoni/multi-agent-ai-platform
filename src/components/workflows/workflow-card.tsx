/**
 * Workflow Card Component
 * Displays a single workflow in the list
 * Following SRP: Only handles card rendering
 */

'use client';

import Link from 'next/link';
import type { WorkflowListItem } from '@/types/workflow.types';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utils/format';
import {
  getWorkflowStatusColor,
  getWorkflowStatusLabel,
} from '@/utils/entity-status';

interface WorkflowCardProps {
  workflow: WorkflowListItem;
}

export const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  return (
    <Link href={`/app/workflows/${workflow.id}`}>
      <Card className="h-full border-2 border-[var(--color-border)] hover:!border-[var(--color-primary)] hover:shadow-lg transition-all cursor-pointer group p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors mb-1">
              {workflow.name}
            </h3>
            {workflow.description && (
              <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                {workflow.description}
              </p>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium text-white rounded ${getWorkflowStatusColor(workflow.status)}`}
          >
            {getWorkflowStatusLabel(workflow.status)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
          <span>Created {formatDate(workflow.created_at)}</span>
          {workflow.last_run_at && (
            <span>Last run {formatDate(workflow.last_run_at)}</span>
          )}
        </div>
      </Card>
    </Link>
  );
};

