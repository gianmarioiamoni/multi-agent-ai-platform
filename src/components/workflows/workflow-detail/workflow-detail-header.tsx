/**
 * Workflow Detail Header Component
 * Displays workflow header with title, status, and actions
 * Following SRP: Only handles header rendering
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Workflow } from '@/types/workflow.types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/format';
import { WorkflowDetailActions } from './workflow-detail-actions';
import { WorkflowStatusBadge } from './workflow-status-badge';

interface WorkflowDetailHeaderProps {
  workflow: Workflow;
}

export const WorkflowDetailHeader = ({ workflow }: WorkflowDetailHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/app/workflows">
                <Button variant="ghost" size="sm">
                  ← Back
                </Button>
              </Link>
              <CardTitle className="text-2xl">{workflow.name}</CardTitle>
              <WorkflowStatusBadge status={workflow.status} />
            </div>
            {workflow.description && (
              <CardDescription className="text-base mt-2">
                {workflow.description}
              </CardDescription>
            )}
          </div>
          <WorkflowDetailActions workflow={workflow} />
        </div>
        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Created:</span> {formatDate(workflow.created_at)}
          </div>
          <div>
            <span className="font-medium">Updated:</span> {formatDate(workflow.updated_at)}
          </div>
          {workflow.last_run_at && (
            <div>
              <span className="font-medium">Last run:</span> {formatDate(workflow.last_run_at)}
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

