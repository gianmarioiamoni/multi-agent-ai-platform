/**
 * Workflow Form Hook
 * Handles form state, validation, and submission for workflow creation/update
 * Following SRP: Only handles form logic
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWorkflowSchema, type CreateWorkflowFormData } from '@/lib/validations/workflow';
import { createWorkflow, updateWorkflow, getWorkflow } from '@/lib/workflows/actions';
import { useToast } from '@/contexts/toast-context';
import type { AgentListItem } from '@/types/agent.types';
import type { WorkflowStep } from '@/types/workflow.types';
import { useAutoSave } from '@/hooks/shared/use-auto-save';
import type { AutoSaveStatus } from '@/hooks/shared/use-auto-save';

interface UseWorkflowFormOptions {
  agents: AgentListItem[];
  workflowId?: string; // If provided, form is in edit mode
}

export const useWorkflowForm = ({ agents, workflowId }: UseWorkflowFormOptions) => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(!!workflowId);
  const isEditMode = !!workflowId;

  const [steps, setSteps] = useState<Array<{ agentId: string; name: string }>>([]);

  const form = useForm<CreateWorkflowFormData>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: '',
      description: '',
      steps: [],
    },
  });

  // Load workflow data in edit mode
  useEffect(() => {
    if (!workflowId) return;

    const loadWorkflow = async () => {
      setIsLoadingWorkflow(true);
      const { data: workflow, error } = await getWorkflow(workflowId);

      if (error || !workflow) {
        addToast('error', 'Error', error || 'Failed to load workflow');
        router.push('/app/workflows');
        return;
      }

      // Convert workflow steps to form format
      const formSteps = workflow.graph.steps.map((step) => ({
        agentId: step.agentId,
        name: step.name,
      }));

      // Populate form with workflow data
      const formData: CreateWorkflowFormData = {
        name: workflow.name || '',
        description: workflow.description || '',
        steps: formSteps,
      };
      
      // Reset form with loaded data
      form.reset(formData, { 
        keepDefaultValues: false,
        keepValues: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });
      setSteps(formSteps);
      setIsLoadingWorkflow(false);
    };

    loadWorkflow();
  }, [workflowId, form, router, addToast]);

  // Sync steps with form
  form.watch('steps');

  const addStep = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    const stepName = `Step ${steps.length + 1}: ${agent.name}`;
    const newStep = { agentId, name: stepName };
    setSteps([...steps, newStep]);
    form.setValue('steps', [...steps, newStep], { shouldDirty: true });
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    form.setValue('steps', newSteps, { shouldDirty: true });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    
    setSteps(newSteps);
    form.setValue('steps', newSteps, { shouldDirty: true });
  };

  const updateStepName = (index: number, name: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], name };
    setSteps(newSteps);
    form.setValue('steps', newSteps, { shouldDirty: true });
  };

  // Helper to convert form data to workflow graph
  const convertToWorkflowGraph = (data: CreateWorkflowFormData) => {
    const workflowSteps: WorkflowStep[] = steps.map((step, index) => ({
      id: `step-${index + 1}`,
      agentId: step.agentId,
      name: step.name,
    }));

    const edges = workflowSteps.slice(0, -1).map((step, index) => ({
      id: `edge-${index + 1}`,
      from: step.id,
      to: workflowSteps[index + 1].id,
    }));

    return {
      steps: workflowSteps,
      edges,
      triggers: {
        manual: true,
      },
    };
  };

  // Auto-save function for edit mode
  const handleAutoSave = async (data: CreateWorkflowFormData) => {
    if (!workflowId) {
      return { success: false, error: 'Workflow ID is required for auto-save' };
    }

    if (steps.length === 0) {
      return { success: false, error: 'At least one step is required' };
    }

    const graph = convertToWorkflowGraph(data);
    const result = await updateWorkflow(workflowId, {
      name: data.name,
      description: data.description || null,
      graph,
    });
    
    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  };

  // Auto-save hook (only enabled in edit mode and after data is loaded)
  const autoSave = useAutoSave({
    form,
    onSave: handleAutoSave,
    enabled: isEditMode,
    skipInitialSave: true,
    isReady: !isLoadingWorkflow, // Disable auto-save while loading
  });

  const onSubmit = async (data: CreateWorkflowFormData) => {
    if (steps.length === 0) {
      addToast('error', 'Error', 'Please add at least one step to the workflow');
      return;
    }

    setIsSubmitting(true);

    try {
      const graph = convertToWorkflowGraph(data);

      if (isEditMode) {
        // Update existing workflow
        const { data: workflow, error } = await updateWorkflow(workflowId!, {
          name: data.name,
          description: data.description || null,
          graph,
        });

        if (error || !workflow) {
          addToast('error', 'Error', error || 'Failed to update workflow');
          return;
        }

        addToast('success', 'Success', 'Workflow updated successfully!');
        router.push(`/app/workflows/${workflowId}`);
      } else {
        // Create new workflow
        const { data: workflow, error } = await createWorkflow({
          name: data.name,
          description: data.description || undefined,
          graph,
        });

        if (error || !workflow) {
          addToast('error', 'Error', error || 'Failed to create workflow');
          return;
        }

        addToast('success', 'Success', 'Workflow created successfully!');
        router.push('/app/workflows');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} workflow:`, error);
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
    isSubmitting: isSubmitting || isLoadingWorkflow,
    autoSave,
    isEditMode,
  };
};

