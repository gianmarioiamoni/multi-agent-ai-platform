/**
 * useAgentExecution Hook
 * Custom hook for executing agents with OpenAI function calling
 * Following SRP: Only handles agent execution logic
 */

'use client';

import { useState, useCallback } from 'react';
import { executeAgent } from '@/lib/agents/execution';
import type { AgentExecutionResult } from '@/types/orchestrator.types';

interface UseAgentExecutionReturn {
  execute: (userMessage: string) => Promise<void>;
  result: AgentExecutionResult | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useAgentExecution(agentId: string): UseAgentExecutionReturn {
  const [result, setResult] = useState<AgentExecutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) {
        setError('Message cannot be empty');
        return;
      }

      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const executionResult = await executeAgent(agentId, userMessage);
        
        setResult(executionResult);

        if (!executionResult.success) {
          setError(executionResult.error || 'Agent execution failed');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [agentId]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    result,
    isLoading,
    error,
    reset,
  };
}

