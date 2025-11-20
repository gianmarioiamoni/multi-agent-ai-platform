/**
 * Centralized Common Types
 * Shared types used across the application
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

