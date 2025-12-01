/**
 * Steps Builder Component
 * Select and order agents for workflow steps
 * Following SRP: Only handles steps UI rendering
 */

'use client';

import type { AgentListItem } from '@/types/agent.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AVAILABLE_MODELS } from '@/types/agent.types';

interface StepsBuilderProps {
  agents: AgentListItem[];
  steps: Array<{ agentId: string; name: string }>;
  onAddStep: (agentId: string) => void;
  onRemoveStep: (index: number) => void;
  onMoveStep: (index: number, direction: 'up' | 'down') => void;
  onUpdateStepName: (index: number, name: string) => void;
}

export const StepsBuilder = ({
  agents,
  steps,
  onAddStep,
  onRemoveStep,
  onMoveStep,
  onUpdateStepName,
}: StepsBuilderProps) => {
  // Filter out agents that are already in steps
  const availableAgents = agents.filter(
    (agent) => !steps.some((step) => step.agentId === agent.id)
  );

  const getAgentById = (agentId: string) => {
    return agents.find((a) => a.id === agentId);
  };

  const handleAgentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agentId = e.target.value;
    if (agentId) {
      onAddStep(agentId);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Steps List */}
      <div className="space-y-4">
        {steps.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
            No steps added yet. Select an agent below to add the first step.
          </div>
        ) : (
          steps.map((step, index) => {
            const agent = getAgentById(step.agentId);
            if (!agent) {return null;}

            const modelInfo = AVAILABLE_MODELS.find((m) => m.id === agent.model);

            return (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center">
                    {index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-3">
                    <Input
                      value={step.name}
                      onChange={(e) => onUpdateStepName(index, e.target.value)}
                      placeholder="Step name..."
                      className="font-medium"
                    />

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{agent.name}</span>
                      </div>
                      <span>•</span>
                      <span>{modelInfo?.name || agent.model}</span>
                      {agent.tools_enabled.length > 0 ? <>
                          <span>•</span>
                          <span>{agent.tools_enabled.length} tool(s)</span>
                        </> : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveStep(index, 'up')}
                      disabled={index === 0}
                      className="p-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                      className="p-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveStep(index)}
                      className="p-2 text-destructive hover:text-destructive"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Agent Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Add Agent to Workflow
        </label>
        <select
          onChange={handleAgentSelect}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          disabled={availableAgents.length === 0}
        >
          <option value="">
            {availableAgents.length === 0
              ? 'No more agents available'
              : 'Select an agent...'}
          </option>
          {availableAgents.map((agent) => {
            const modelInfo = AVAILABLE_MODELS.find((m) => m.id === agent.model);
            return (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({modelInfo?.name || agent.model})
              </option>
            );
          })}
        </select>
        {availableAgents.length === 0 && steps.length > 0 ? <p className="text-xs text-muted-foreground mt-1">
            All available agents have been added to this workflow.
          </p> : null}
      </div>
    </div>
  );
};

