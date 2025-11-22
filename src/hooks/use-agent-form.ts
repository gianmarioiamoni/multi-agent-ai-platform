/**
 * Agent Form Hook
 * Custom hook for agent creation/update logic
 * Following SRP: Only handles form state and submission
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/contexts/toast-context';
import { createAgent } from '@/lib/agents/actions';
import { createAgentSchema, type CreateAgentFormData } from '@/lib/validations/agent';

export const useAgentForm = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: '',
      description: '',
      role: '',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 2000,
      tools_enabled: [],
    },
  });

  const handleSubmit = async (data: CreateAgentFormData) => {
    setIsLoading(true);

    try {
      const result = await createAgent(data);

      if (result.error) {
        addToast({
          type: 'error',
          message: result.error,
        });
        return;
      }

      addToast({
        type: 'success',
        message: 'Agent created successfully!',
      });

      // Redirect to agents list
      router.push('/app/agents');
    } catch (error) {
      console.error('Error creating agent:', error);
      addToast({
        type: 'error',
        message: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};

