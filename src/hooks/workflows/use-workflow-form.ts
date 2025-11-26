/**
 * Workflow Form Hook
 * Handles form state, validation, and submission for workflow creation
 * Following SRP: Only handles form logic
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWorkflowSchema, type CreateWorkflowFormData } from '@/lib/validations/workflow';
import { createWorkflow } from '@/lib/workflows/actions';
import { useToast } from '@/contexts/toast-context';
import type { AgentListItem } from '@/types/agent.types';
import type { WorkflowStep } from '@/types/workflow.types';

interface UseWorkflowFormOptions {
  agents: AgentListItem[];
}

export const useWorkflowForm = ({ agents }: UseWorkflowFormOptions) => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [steps, setSteps] = useState<Array<{ agentId: string; name: string }>>([]);

  const form = useForm<CreateWorkflowFormData>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: '',
      description: '',
      steps: [],
    },
  });

  // Sync steps with form
  form.watch('steps');

  const addStep = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    const stepName = `Step ${steps.length + 1}: ${agent.name}`;
    const newStep = { agentId, name: stepName };
    setSteps([...steps, newStep]);
    form.setValue('steps', [...steps, newStep]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    form.setValue('steps', newSteps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    
    setSteps(newSteps);
    form.setValue('steps', newSteps);
  };

  const updateStepName = (index: number, name: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], name };
    setSteps(newSteps);
    form.setValue('steps', newSteps);
  };

  const onSubmit = async (data: CreateWorkflowFormData) => {
    if (steps.length === 0) {
      addToast('error', 'Error', 'Please add at least one step to the workflow');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert steps to WorkflowStep format
      const workflowSteps: WorkflowStep[] = steps.map((step, index) => ({
        id: `step-${index + 1}`,
        agentId: step.agentId,
        name: step.name,
      }));

      // Create edges between steps (sequential)
      const edges = workflowSteps.slice(0, -1).map((step, index) => ({
        id: `edge-${index + 1}`,
        from: step.id,
        to: workflowSteps[index + 1].id,
      }));

      const { data: workflow, error } = await createWorkflow({
        name: data.name,
        description: data.description || undefined,
        graph: {
          steps: workflowSteps,
          edges,
          triggers: {
            manual: true,
          },
        },
      });

      if (error || !workflow) {
        addToast('error', 'Error', error || 'Failed to create workflow');
        return;
      }

      addToast('success', 'Success', 'Workflow created successfully!');

      router.push('/app/workflows');
    } catch (error) {
      console.error('Error creating workflow:', error);
      addToast('error', 'Error', 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    steps,
    addStep,
    removeStep,
    moveStep,
    updateStepName,
    onSubmit,
    isSubmitting,
  };
};

