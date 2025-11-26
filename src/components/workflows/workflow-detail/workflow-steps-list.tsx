/**
 * Workflow Steps List Component
 * Displays list of workflow steps
 * Following SRP: Only handles steps list rendering
 */

'use client';

import type { WorkflowStep } from '@/types/workflow.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useWorkflowSteps } from './use-workflow-steps';

interface WorkflowStepsListProps {
  steps: WorkflowStep[];
}

export const WorkflowStepsList = ({ steps }: WorkflowStepsListProps) => {
  const { stepsWithAgents, isLoading } = useWorkflowSteps(steps);

  if (steps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No steps configured yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Steps ({steps.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stepsWithAgents.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-4 p-4 border rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{step.name}</h4>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading agent...</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Agent: {step.agentName || 'Unknown'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

