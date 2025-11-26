/**
 * Workflow Builder Component
 * Main form for creating workflows
 * Following SRP: Only handles form composition
 */

'use client';

import { FormProvider } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { AgentListItem } from '@/types/agent.types';
import { useWorkflowForm } from '@/hooks/workflows/use-workflow-form';
import { BasicInfoSection } from './workflow-builder/basic-info-section';
import { StepsBuilder } from './workflow-builder/steps-builder';
import { FormActions } from './workflow-builder/form-actions';

interface WorkflowBuilderProps {
  agents: AgentListItem[];
}

export const WorkflowBuilder = ({ agents }: WorkflowBuilderProps) => {
  const {
    form,
    steps,
    addStep,
    removeStep,
    moveStep,
    updateStepName,
    onSubmit,
    isSubmitting,
  } = useWorkflowForm({ agents });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Give your workflow a name and description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BasicInfoSection />
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Steps</CardTitle>
            <CardDescription>
              Add agents to your workflow in the order they should execute. Each step will receive the output from the previous step.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepsBuilder
              agents={agents}
              steps={steps}
              onAddStep={addStep}
              onRemoveStep={removeStep}
              onMoveStep={moveStep}
              onUpdateStepName={updateStepName}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <FormActions isLoading={isSubmitting} />
      </form>
    </FormProvider>
  );
};

