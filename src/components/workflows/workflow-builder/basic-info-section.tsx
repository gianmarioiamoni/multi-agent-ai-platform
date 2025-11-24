/**
 * Basic Info Section Component
 * Name and description fields for workflow
 * Following SRP: Only handles basic info form rendering
 */

'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CreateWorkflowFormData } from '@/lib/validations/workflow';

export const BasicInfoSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateWorkflowFormData>();

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" required>
          Workflow Name
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Weekly Report Automation"
          error={errors.name?.message}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe what this workflow does..."
          rows={3}
          error={errors.description?.message}
        />
      </div>
    </div>
  );
};

