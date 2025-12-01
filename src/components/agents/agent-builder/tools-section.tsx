/**
 * Tools Section Component
 * Tool selection checkboxes for agent builder
 * Following SRP: Only handles tool selection rendering
 */

'use client';

import { useFormContext } from 'react-hook-form';
import { AVAILABLE_TOOLS } from '@/types/agent.types';
import type { CreateAgentFormData } from '@/lib/validations/agent';

export const ToolsSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateAgentFormData>();

  const selectedTools = watch('tools_enabled') || [];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AVAILABLE_TOOLS.map((tool) => {
          const isSelected = selectedTools.includes(tool.id);
          const isDisabled = tool.comingSoon;

          return (
            <label
              key={tool.id}
              className={`relative flex items-start cursor-pointer rounded-lg border p-4 transition-colors ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input
                type="checkbox"
                {...register('tools_enabled')}
                value={tool.id}
                disabled={isDisabled}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tool.name}</span>
                  {tool.comingSoon ? <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-md">
                      Coming Soon
                    </span> : null}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {tool.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
      {errors.tools_enabled ? <p className="text-destructive text-sm mt-2">
          {errors.tools_enabled.message}
        </p> : null}
      {selectedTools.length === 0 ? <p className="text-muted-foreground text-sm mt-3">
          💡 Select at least one tool to enable the agent to perform actions
        </p> : null}
    </div>
  );
};

