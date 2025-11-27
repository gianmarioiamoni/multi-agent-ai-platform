/**
 * Entity Status Utilities
 * Common status colors and labels for agents and workflows
 * Following DRY: Centralizes entity status mapping logic
 */

import type { AgentStatus } from '@/types/agent.types';
import type { WorkflowStatus } from '@/types/workflow.types';

/**
 * Agent status color mapping
 * Used for badge backgrounds with opacity
 */
export const agentStatusColors: Record<AgentStatus, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  archived: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

/**
 * Agent status label mapping
 * Used for badge text
 */
export const agentStatusLabels: Record<AgentStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

/**
 * Workflow status color mapping
 * Used for badge backgrounds
 */
export const workflowStatusColors: Record<WorkflowStatus, string> = {
  draft: 'bg-gray-500',
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  archived: 'bg-gray-400',
};

/**
 * Workflow status label mapping (for cards with solid backgrounds)
 * Used for badge text
 */
export const workflowStatusLabels: Record<WorkflowStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
};

/**
 * Workflow status color mapping with opacity (for badges)
 * Used for badge backgrounds with opacity
 */
export const workflowStatusBadgeColors: Record<WorkflowStatus, string> = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  archived: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

/**
 * Get agent status color for badge
 */
export function getAgentStatusColor(status: AgentStatus): string {
  return agentStatusColors[status] || agentStatusColors.inactive;
}

/**
 * Get agent status label
 */
export function getAgentStatusLabel(status: AgentStatus): string {
  return agentStatusLabels[status] || agentStatusLabels.inactive;
}

/**
 * Get workflow status color for card badge (solid background)
 */
export function getWorkflowStatusColor(status: WorkflowStatus): string {
  return workflowStatusColors[status] || workflowStatusColors.draft;
}

/**
 * Get workflow status color for badge (with opacity)
 */
export function getWorkflowStatusBadgeColor(status: WorkflowStatus): string {
  return workflowStatusBadgeColors[status] || workflowStatusBadgeColors.draft;
}

/**
 * Get workflow status label
 */
export function getWorkflowStatusLabel(status: WorkflowStatus): string {
  return workflowStatusLabels[status] || workflowStatusLabels.draft;
}

