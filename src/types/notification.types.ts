/**
 * Notification Types
 * Type definitions for user notifications
 */

export type NotificationType = 'workflow_completed' | 'workflow_failed' | 'workflow_started' | 'integration_error' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  createdAt: string;
  read: boolean;
}

