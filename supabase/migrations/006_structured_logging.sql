-- Migration: Structured Logging Table
-- Sprint 4, Week 7: Structured logging system
-- Creates logs table for application-wide structured logging

-- ============================================================================
-- LOGS TABLE
-- ============================================================================
-- Stores structured application logs for debugging, monitoring, and audit

CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Log metadata
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'critical')),
  category TEXT NOT NULL, -- e.g., 'agent.execution', 'workflow.engine', 'tool.calendar'
  message TEXT NOT NULL,
  
  -- Context data (JSONB for flexible structure)
  context JSONB DEFAULT '{}'::jsonb,
  
  -- Related entities (optional foreign keys)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
  workflow_run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  agent_run_id UUID REFERENCES agent_runs(id) ON DELETE SET NULL,
  
  -- Error details (for error/critical logs)
  error_type TEXT,
  error_message TEXT,
  stack_trace TEXT,
  
  -- Request context
  request_id TEXT, -- For tracing requests across services
  duration_ms INTEGER, -- Execution time in milliseconds
  
  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_category ON logs(category);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_agent_id ON logs(agent_id) WHERE agent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_workflow_id ON logs(workflow_id) WHERE workflow_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_workflow_run_id ON logs(workflow_run_id) WHERE workflow_run_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_agent_run_id ON logs(agent_run_id) WHERE agent_run_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_logs_request_id ON logs(request_id) WHERE request_id IS NOT NULL;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_logs_level_category_created ON logs(level, category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_user_created ON logs(user_id, created_at DESC) WHERE user_id IS NOT NULL;

-- Enable RLS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own logs
CREATE POLICY "Users can view their own logs"
ON logs
FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM agents WHERE agents.id = logs.agent_id AND agents.owner_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM workflows WHERE workflows.id = logs.workflow_id AND workflows.owner_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM workflow_runs 
    WHERE workflow_runs.id = logs.workflow_run_id 
    AND workflow_runs.created_by = auth.uid()
  )
);

-- Admins can view all logs
CREATE POLICY "Admins can view all logs"
ON logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Service role can insert logs (for application logging)
CREATE POLICY "Service role can insert logs"
ON logs
FOR INSERT
WITH CHECK (true);

-- Function to clean old logs (optional, for maintenance)
CREATE OR REPLACE FUNCTION clean_old_logs(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM logs
  WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL
  AND level IN ('debug', 'info'); -- Keep errors and warnings longer
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Comment on table
COMMENT ON TABLE logs IS 'Structured application logs for debugging, monitoring, and audit trail';
COMMENT ON COLUMN logs.level IS 'Log level: debug, info, warn, error, critical';
COMMENT ON COLUMN logs.category IS 'Log category for filtering (e.g., agent.execution, workflow.engine)';
COMMENT ON COLUMN logs.context IS 'Additional context data as JSON';
COMMENT ON COLUMN logs.request_id IS 'Request ID for tracing requests across services';

