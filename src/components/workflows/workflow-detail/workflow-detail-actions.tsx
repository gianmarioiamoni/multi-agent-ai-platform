/**
 * Workflow Detail Actions Component
 * Handles workflow actions (edit, delete, run)
 * Following SRP: Only handles action logic and UI
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Workflow } from '@/types/workflow.types';
import { Button } from '@/components/ui/button';
import { deleteWorkflow, runWorkflow } from '@/lib/workflows/actions';
import { useToast } from '@/contexts/toast-context';
import { WorkflowRunDialog } from './workflow-run-dialog';

interface WorkflowDetailActionsProps {
  workflow: Workflow;
}

export const WorkflowDetailActions = ({ workflow }: WorkflowDetailActionsProps) => {
  const router = useRouter();
  const { success, error: showError, info } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRunDialog, setShowRunDialog] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const { error } = await deleteWorkflow(workflow.id);

    if (error) {
      showError('Error', error);
      setIsDeleting(false);
      return;
    }

    success('Success', 'Workflow deleted successfully');

    router.push('/app/workflows');
  };

  const handleRun = () => {
    setShowRunDialog(true);
  };

  const handleEdit = () => {
    router.push(`/app/workflows/${workflow.id}/edit`);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {workflow.status === 'active' && (
          <Button onClick={handleRun} size="sm">
            Run Workflow
          </Button>
        )}
        <Button onClick={handleEdit} variant="outline" size="sm">
          Edit
        </Button>
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="sm"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
      {showRunDialog && (
        <WorkflowRunDialog
          workflow={workflow}
          open={showRunDialog}
          onOpenChange={setShowRunDialog}
        />
      )}
    </>
  );
};

