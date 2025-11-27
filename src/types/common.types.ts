/**
 * Common Types
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
  error: string;
  message?: string;
}

/**
 * Generic database entity with id and other properties
 * Used for Supabase query results when type inference fails
 */
export interface DatabaseEntity {
  id: string;
  [key: string]: unknown;
}

/**
 * Array of database entities
 * Used for Supabase query results when type inference fails
 */
export type DatabaseEntityArray = Array<DatabaseEntity>;

/**
 * Supabase query result with data array of entities
 * Used when type inference fails and we need to cast query results
 */
export interface DatabaseQueryResult<T = DatabaseEntity> {
  data: Array<T> | null;
  error?: unknown;
}
