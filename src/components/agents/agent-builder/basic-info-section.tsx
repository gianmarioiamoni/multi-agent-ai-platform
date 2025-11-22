/**
 * Basic Info Section Component
 * Name, description, and role fields for agent builder
 * Following SRP: Only handles basic info fields rendering
 */

'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateAgentFormData } from '@/lib/validations/agent';

export const BasicInfoSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateAgentFormData>();

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name" required>
          Agent Name
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Research Assistant"
          error={errors.name?.message}
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Brief description of what this agent does..."
          className="w-full min-h-[80px] px-3 py-2 bg-[var(--color-input)] border border-[var(--color-border)] rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
        />
        {errors.description && (
          <p className="text-destructive text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Role (System Prompt) */}
      <div>
        <Label htmlFor="role" required>
          Agent Role (System Prompt)
        </Label>
        <textarea
          id="role"
          {...register('role')}
          placeholder="You are a helpful research assistant that..."
          className="w-full min-h-[120px] px-3 py-2 bg-[var(--color-input)] border border-[var(--color-border)] rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y font-mono"
        />
        {errors.role && (
          <p className="text-destructive text-sm mt-1">{errors.role.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Define the agent's personality, expertise, and behavior
        </p>
      </div>
    </div>
  );
};

