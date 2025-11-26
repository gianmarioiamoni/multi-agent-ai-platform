/**
 * Workflow Run Dialog Component
 * Dialog to run a workflow with input
 * Following SRP: Only handles run dialog logic and UI
 */

'use client';

import { useState } from 'react';
import type { Workflow } from '@/types/workflow.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { runWorkflow } from '@/lib/workflows/actions';
import { useToast } from '@/contexts/toast-context';
import { useRouter } from 'next/navigation';

interface WorkflowRunDialogProps {
  workflow: Workflow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WorkflowRunDialog = ({
  workflow,
  open,
  onOpenChange,
}: WorkflowRunDialogProps) => {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (!input.trim()) {
      showError('Error', 'Please provide input for the workflow');
      return;
    }

    setIsRunning(true);
    const { data, error } = await runWorkflow(workflow.id, input);

    if (error) {
      showError('Error', error);
      setIsRunning(false);
      return;
    }

    success('Success', 'Workflow started successfully');

    onOpenChange(false);
    router.push(`/app/runs/${data?.workflowRunId || ''}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run Workflow: {workflow.name}</DialogTitle>
          <DialogDescription>
            Provide input for the workflow execution
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="input">Input</Label>
            <Textarea
              id="input"
              placeholder="Enter workflow input..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              disabled={isRunning}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isRunning}
          >
            Cancel
          </Button>
          <Button onClick={handleRun} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run Workflow'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

