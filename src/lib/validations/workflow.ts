/**
 * Workflow Validation Schemas
 * Zod schemas for workflow creation and updates
 */

import { z } from 'zod';

export const createWorkflowSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  steps: z
    .array(
      z.object({
        agentId: z.string().uuid('Invalid agent ID'),
        name: z.string().min(1, 'Step name is required').max(100, 'Step name must be less than 100 characters'),
      })
    )
    .min(1, 'At least one step is required'),
});

export type CreateWorkflowFormData = z.infer<typeof createWorkflowSchema>;

