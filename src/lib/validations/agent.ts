/**
 * Agent Validation Schemas
 * Zod schemas for agent forms
 */

import { z } from 'zod';

export const createAgentSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  
  role: z
    .string()
    .min(10, 'Role must be at least 10 characters')
    .max(2000, 'Role must be less than 2000 characters'),
  
  model: z.enum(['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']),
  
  temperature: z
    .number()
    .min(0, 'Temperature must be between 0 and 2')
    .max(2, 'Temperature must be between 0 and 2')
    .default(0.7),
  
  max_tokens: z
    .number()
    .min(100, 'Max tokens must be at least 100')
    .max(4096, 'Max tokens must be at most 4096')
    .default(2000),
  
  tools_enabled: z
    .array(z.enum(['web_search', 'email', 'calendar', 'db_ops']))
    .default([]),
});

export type CreateAgentFormData = z.infer<typeof createAgentSchema>;

