/**
 * Model Config Section Component
 * Model selection and parameter configuration
 * Following SRP: Only handles model configuration fields
 */

'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { AVAILABLE_MODELS } from '@/types/agent.types';
import type { CreateAgentFormData } from '@/lib/validations/agent';

export const ModelConfigSection = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateAgentFormData>();

  const selectedModel = watch('model');
  const selectedModelInfo = AVAILABLE_MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div>
        <Label htmlFor="model" required>
          AI Model
        </Label>
        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = field.value === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => field.onChange(model.id)}
                    className={`relative flex cursor-pointer rounded-lg border p-4 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{model.name}</span>
                        {isSelected ? <svg
                            className="w-5 h-5 text-primary"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg> : null}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {model.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>${model.costPer1kTokens}/1K tokens</span>
                        <span>•</span>
                        <span>Max {model.maxTokens} tokens</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        />
        {errors.model ? <p className="text-destructive text-sm mt-1">{errors.model.message}</p> : null}
      </div>

      {/* Temperature */}
      <Controller
        name="temperature"
        control={control}
        render={({ field }) => (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm text-muted-foreground">
                {field.value?.toFixed(1) ?? '0.0'}
              </span>
            </div>
            <input
              type="range"
              id="temperature"
              value={field.value}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              min="0"
              max="2"
              step="0.1"
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Focused (0)</span>
              <span>Balanced (1)</span>
              <span>Creative (2)</span>
            </div>
            {errors.temperature ? <p className="text-destructive text-sm mt-1">
                {errors.temperature.message}
              </p> : null}
          </div>
        )}
      />

      {/* Max Tokens */}
      <Controller
        name="max_tokens"
        control={control}
        render={({ field }) => (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="max_tokens">Max Tokens</Label>
              <span className="text-sm text-muted-foreground">
                {field.value}
              </span>
            </div>
            <input
              type="range"
              id="max_tokens"
              value={field.value}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
              min="100"
              max={selectedModelInfo?.maxTokens || 4096}
              step="100"
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum length of the agent&apos;s response
            </p>
            {errors.max_tokens ? <p className="text-destructive text-sm mt-1">
                {errors.max_tokens.message}
              </p> : null}
          </div>
        )}
      />
    </div>
  );
};

