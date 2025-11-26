/**
 * Database Types
 * These types will be generated from Supabase schema
 * For now, we provide a placeholder structure
 * 
 * To generate these types from your Supabase project:
 * npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          role: 'user' | 'admin';
          settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          role?: 'user' | 'admin';
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          role?: 'user' | 'admin';
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Additional tables will be added in Sprint 2
      agents: {
        Row: Record<string, never>;
        Insert: Record<string, never>;
        Update: Record<string, never>;
      };
      workflows: {
        Row: Record<string, never>;
        Insert: Record<string, never>;
        Update: Record<string, never>;
      };
      logs: {
        Row: {
          id: string;
          level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
          category: string;
          message: string;
          context: Json;
          user_id: string | null;
          agent_id: string | null;
          workflow_id: string | null;
          workflow_run_id: string | null;
          agent_run_id: string | null;
          error_type: string | null;
          error_message: string | null;
          stack_trace: string | null;
          request_id: string | null;
          duration_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
          category: string;
          message: string;
          context?: Json;
          user_id?: string | null;
          agent_id?: string | null;
          workflow_id?: string | null;
          workflow_run_id?: string | null;
          agent_run_id?: string | null;
          error_type?: string | null;
          error_message?: string | null;
          stack_trace?: string | null;
          request_id?: string | null;
          duration_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          level?: 'debug' | 'info' | 'warn' | 'error' | 'critical';
          category?: string;
          message?: string;
          context?: Json;
          user_id?: string | null;
          agent_id?: string | null;
          workflow_id?: string | null;
          workflow_run_id?: string | null;
          agent_run_id?: string | null;
          error_type?: string | null;
          error_message?: string | null;
          stack_trace?: string | null;
          request_id?: string | null;
          duration_ms?: number | null;
          created_at?: string;
        };
      };
      notification_reads: {
        Row: {
          id: string;
          user_id: string;
          notification_id: string;
          read_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_id: string;
          read_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notification_id?: string;
          read_at?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'user' | 'admin';
    };
  };
}

// Helper types for easier access
export type UserRole = Database['public']['Enums']['user_role'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

