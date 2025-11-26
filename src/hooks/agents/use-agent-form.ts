/**
 * Agent Form Hook
 * Custom hook for agent creation/update logic
 * Following SRP: Only handles form state and submission
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/contexts/toast-context';
import { createAgent, updateAgent, getAgent } from '@/lib/agents/actions';
import { createAgentSchema, type CreateAgentFormData } from '@/lib/validations/agent';
import { AVAILABLE_MODELS } from '@/types/agent.types';
import { useAutoSave } from '@/hooks/shared/use-auto-save';
import type { AutoSaveStatus } from '@/hooks/shared/use-auto-save';
import type { Agent } from '@/types/agent.types';

interface UseAgentFormProps {
  defaultModel?: string;
  agentId?: string; // If provided, form is in edit mode
  agent?: Agent; // If provided, pre-loaded agent data (avoids reload)
}

export const useAgentForm = (defaultModel?: string, agentId?: string, agent?: Agent) => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAgent, setIsLoadingAgent] = useState(!!agentId);
  const isEditMode = !!agentId;

  // Validate defaultModel against available models, fallback to gpt-4o-mini
  const validDefaultModel = defaultModel && AVAILABLE_MODELS.some(m => m.id === defaultModel)
    ? defaultModel
    : 'gpt-4o-mini';

  const form = useForm<CreateAgentFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createAgentSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      role: '',
      model: validDefaultModel as CreateAgentFormData['model'],
      temperature: 0.7,
      max_tokens: 2000,
      tools_enabled: [],
    },
  });

  // Load agent data in edit mode
  useEffect(() => {
    if (!agentId) {
      setIsLoadingAgent(false);
      return;
    }

    // If agent data is already provided, use it directly (avoids reload)
    if (agent) {
      setIsLoadingAgent(false);
      const formData: CreateAgentFormData = {
        name: agent.name || '',
        description: agent.description || '',
        role: agent.role || '',
        model: agent.model as CreateAgentFormData['model'],
        temperature: agent.temperature ?? 0.7,
        max_tokens: agent.max_tokens ?? 2000,
        tools_enabled: (agent.tools_enabled || []) as CreateAgentFormData['tools_enabled'],
      };
      
      form.reset(formData, { 
        keepDefaultValues: false,
        keepValues: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });
      return;
    }

    // Otherwise, load from server
    const loadAgent = async () => {
      setIsLoadingAgent(true);
      const { data: loadedAgent, error } = await getAgent(agentId);

      if (error || !loadedAgent) {
        addToast('error', 'Error', error || 'Failed to load agent');
        router.push('/app/agents');
        return;
      }

      // Populate form with agent data
      const formData: CreateAgentFormData = {
        name: loadedAgent.name || '',
        description: loadedAgent.description || '',
        role: loadedAgent.role || '',
        model: loadedAgent.model as CreateAgentFormData['model'],
        temperature: loadedAgent.temperature ?? 0.7,
        max_tokens: loadedAgent.max_tokens ?? 2000,
        tools_enabled: (loadedAgent.tools_enabled || []) as CreateAgentFormData['tools_enabled'],
      };
      
      form.reset(formData, { 
        keepDefaultValues: false,
        keepValues: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });

      setIsLoadingAgent(false);
    };

    loadAgent();
  }, [agentId, agent, form, router, addToast]);

  // Auto-save function for edit mode
  const handleAutoSave = async (data: CreateAgentFormData) => {
    if (!agentId) {
      return { success: false, error: 'Agent ID is required for auto-save' };
    }

    const result = await updateAgent(agentId, data);
    
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
    isReady: !isLoadingAgent, // Disable auto-save while loading
  });

  const handleSubmit = async (data: CreateAgentFormData) => {
    setIsLoading(true);

    try {
      if (isEditMode) {
        // Update existing agent
        const result = await updateAgent(agentId!, data);

        if (result.error) {
          addToast('error', 'Error', result.error);
          return;
        }

        addToast('success', 'Success', 'Agent updated successfully!');
        router.push(`/app/agents/${agentId}`);
      } else {
        // Create new agent
        const result = await createAgent(data);

        if (result.error) {
          addToast('error', 'Error', result.error);
          return;
        }

        addToast('success', 'Success', 'Agent created successfully!');
        router.push('/app/agents');
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} agent:`, error);
      addToast('error', 'Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading: isLoading || isLoadingAgent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmit: form.handleSubmit(handleSubmit) as any,
    autoSave,
    isEditMode,
  };
};

