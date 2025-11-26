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
          is_demo: boolean;
          is_disabled: boolean;
          settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          role?: 'user' | 'admin';
          is_demo?: boolean;
          is_disabled?: boolean;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          role?: 'user' | 'admin';
          is_demo?: boolean;
          is_disabled?: boolean;
          settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          role: string;
          model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
          temperature: number;
          max_tokens: number;
          tools_enabled: string[];
          config: Json;
          status: 'active' | 'inactive' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          role: string;
          model?: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
          temperature?: number;
          max_tokens?: number;
          tools_enabled?: string[];
          config?: Json;
          status?: 'active' | 'inactive' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          role?: string;
          model?: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
          temperature?: number;
          max_tokens?: number;
          tools_enabled?: string[];
          config?: Json;
          status?: 'active' | 'inactive' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      workflows: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          graph: Json;
          status: 'draft' | 'active' | 'paused' | 'archived';
          created_at: string;
          updated_at: string;
          last_run_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          graph?: Json;
          status?: 'draft' | 'active' | 'paused' | 'archived';
          created_at?: string;
          updated_at?: string;
          last_run_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          graph?: Json;
          status?: 'draft' | 'active' | 'paused' | 'archived';
          created_at?: string;
          updated_at?: string;
          last_run_at?: string | null;
        };
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
      workflow_runs: {
        Row: {
          id: string;
          workflow_id: string;
          status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
          input: string | null;
          output: string | null;
          error: string | null;
          started_at: string | null;
          finished_at: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workflow_id: string;
          status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
          input?: string | null;
          output?: string | null;
          error?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workflow_id?: string;
          status?: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
          input?: string | null;
          output?: string | null;
          error?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      agent_runs: {
        Row: {
          id: string;
          workflow_run_id: string;
          agent_id: string;
          status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
          step_order: number;
          input: string | null;
          output: string | null;
          error: string | null;
          started_at: string | null;
          finished_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workflow_run_id: string;
          agent_id: string;
          status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
          step_order: number;
          input?: string | null;
          output?: string | null;
          error?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workflow_run_id?: string;
          agent_id?: string;
          status?: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
          step_order?: number;
          input?: string | null;
          output?: string | null;
          error?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tool_invocations: {
        Row: {
          id: string;
          agent_run_id: string;
          tool: string;
          params: Json;
          status: 'pending' | 'running' | 'completed' | 'failed';
          result: Json | null;
          error: string | null;
          started_at: string | null;
          finished_at: string | null;
          execution_time_ms: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_run_id: string;
          tool: string;
          params?: Json;
          status?: 'pending' | 'running' | 'completed' | 'failed';
          result?: Json | null;
          error?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
          execution_time_ms?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agent_run_id?: string;
          tool?: string;
          params?: Json;
          status?: 'pending' | 'running' | 'completed' | 'failed';
          result?: Json | null;
          error?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
          execution_time_ms?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stored_credentials: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          encrypted_data: string; // BYTEA is returned as hex string in Supabase
          is_active: boolean;
          expires_at: string | null;
          scopes: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          encrypted_data: string; // BYTEA input as hex string
          is_active?: boolean;
          expires_at?: string | null;
          scopes?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          encrypted_data?: string;
          is_active?: boolean;
          expires_at?: string | null;
          scopes?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'user' | 'admin';
      ai_model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
      agent_status: 'active' | 'inactive' | 'archived';
      workflow_status: 'draft' | 'active' | 'paused' | 'archived';
      workflow_run_status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
      agent_run_status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
      tool_invocation_status: 'pending' | 'running' | 'completed' | 'failed';
    };
  };
}

// Helper types for easier access
export type UserRole = Database['public']['Enums']['user_role'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
