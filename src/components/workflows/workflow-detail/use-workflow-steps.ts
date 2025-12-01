/**
 * Workflow Steps Hook
 * Fetches agent names for workflow steps
 * Following SRP: Only handles data fetching logic
 */

'use client';

import { useState, useEffect } from 'react';
import type { WorkflowStep } from '@/types/workflow.types';
import { getAgent } from '@/lib/agents/actions';

interface StepWithAgent extends WorkflowStep {
  agentName?: string;
}

export const useWorkflowSteps = (steps: WorkflowStep[]) => {
  const [stepsWithAgents, setStepsWithAgents] = useState<StepWithAgent[]>(steps);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgentNames = async () => {
      setIsLoading(true);
      const stepsWithNames = await Promise.all(
        steps.map(async (step) => {
          try {
            const { data: agent } = await getAgent(step.agentId);
            return {
              ...step,
              agentName: agent?.name || 'Unknown',
            };
          } catch {
            return {
              ...step,
              agentName: 'Unknown',
            };
          }
        })
      );
      setTimeout(() => {
        setStepsWithAgents(stepsWithNames);
        setIsLoading(false);
      }, 0);
    };

    if (steps.length > 0) {
      fetchAgentNames();
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 0);
    }
  }, [steps]);

  return { stepsWithAgents, isLoading };
};

