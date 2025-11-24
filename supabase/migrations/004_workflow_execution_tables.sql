-- Migration: Workflow Execution Tables
-- Sprint 3, Week 5
-- Creates tables for workflow execution tracking: workflow_runs, agent_runs, tool_invocations

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Workflow run status
CREATE TYPE workflow_run_status AS ENUM (
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled'
);

-- Agent run status
CREATE TYPE agent_run_status AS ENUM (
  'pending',
  'running',
  'completed',
  'failed',
  'skipped'
);

-- Tool invocation status
CREATE TYPE tool_invocation_status AS ENUM (
  'pending',
  'running',
  'completed',
  'failed'
);

-- ============================================================================
-- WORKFLOW_RUNS TABLE
-- ============================================================================

CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Workflow reference
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  
  -- Execution info
  status workflow_run_status NOT NULL DEFAULT 'pending',
  input TEXT, -- Initial input for the workflow
  output TEXT, -- Final output of the workflow
  error TEXT, -- Error message if failed
  
  -- Timing
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  
  -- Creator
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT finished_after_started CHECK (
    finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at
  )
);

-- Indexes for workflow_runs
CREATE INDEX idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);
CREATE INDEX idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX idx_workflow_runs_created_by ON workflow_runs(created_by);
CREATE INDEX idx_workflow_runs_created_at ON workflow_runs(created_at DESC);
CREATE INDEX idx_workflow_runs_started_at ON workflow_runs(started_at DESC);

-- RLS for workflow_runs
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;

-- Users can view their own workflow runs
CREATE POLICY "Users can view own workflow runs"
  ON workflow_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.owner_id = auth.uid()
    )
  );

-- Users can create workflow runs for their workflows
CREATE POLICY "Users can create workflow runs"
  ON workflow_runs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.owner_id = auth.uid()
    )
    AND created_by = auth.uid()
  );

-- Users can update their own workflow runs
CREATE POLICY "Users can update own workflow runs"
  ON workflow_runs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.owner_id = auth.uid()
    )
  );

-- Admins can view all workflow runs
CREATE POLICY "Admins can view all workflow runs"
  ON workflow_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- AGENT_RUNS TABLE
-- ============================================================================

CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Workflow run reference
  workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  
  -- Agent reference
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE RESTRICT,
  
  -- Execution info
  status agent_run_status NOT NULL DEFAULT 'pending',
  step_order INTEGER NOT NULL, -- Order in workflow execution
  input TEXT, -- Input for this agent (output from previous step or initial input)
  output TEXT, -- Output from this agent (becomes input for next step)
  error TEXT, -- Error message if failed
  
  -- Timing
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT step_order_positive CHECK (step_order > 0),
  CONSTRAINT finished_after_started CHECK (
    finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at
  )
);

-- Indexes for agent_runs
CREATE INDEX idx_agent_runs_workflow_run_id ON agent_runs(workflow_run_id);
CREATE INDEX idx_agent_runs_agent_id ON agent_runs(agent_id);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);
CREATE INDEX idx_agent_runs_step_order ON agent_runs(workflow_run_id, step_order);

-- RLS for agent_runs
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

-- Users can view agent runs for their workflow runs
CREATE POLICY "Users can view own agent runs"
  ON agent_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workflow_runs wr
      JOIN workflows w ON w.id = wr.workflow_id
      WHERE wr.id = agent_runs.workflow_run_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can create agent runs for their workflow runs
CREATE POLICY "Users can create agent runs"
  ON agent_runs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflow_runs wr
      JOIN workflows w ON w.id = wr.workflow_id
      WHERE wr.id = agent_runs.workflow_run_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can update agent runs for their workflow runs
CREATE POLICY "Users can update own agent runs"
  ON agent_runs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workflow_runs wr
      JOIN workflows w ON w.id = wr.workflow_id
      WHERE wr.id = agent_runs.workflow_run_id
      AND w.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflow_runs wr
      JOIN workflows w ON w.id = wr.workflow_id
      WHERE wr.id = agent_runs.workflow_run_id
      AND w.owner_id = auth.uid()
    )
  );

-- Admins can view all agent runs
CREATE POLICY "Admins can view all agent runs"
  ON agent_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- TOOL_INVOCATIONS TABLE
-- ============================================================================

CREATE TABLE tool_invocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Agent run reference
  agent_run_id UUID NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
  
  -- Tool info
  tool TEXT NOT NULL, -- Tool ID (e.g., 'web_search', 'email')
  params JSONB NOT NULL DEFAULT '{}'::jsonb, -- Tool parameters
  
  -- Execution result
  status tool_invocation_status NOT NULL DEFAULT 'pending',
  result JSONB, -- Tool execution result (success)
  error TEXT, -- Error message if failed
  
  -- Timing
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  execution_time_ms INTEGER, -- Execution time in milliseconds
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT tool_not_empty CHECK (char_length(tool) > 0),
  CONSTRAINT finished_after_started CHECK (
    finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at
  ),
  CONSTRAINT execution_time_positive CHECK (
    execution_time_ms IS NULL OR execution_time_ms >= 0
  )
);

-- Indexes for tool_invocations
CREATE INDEX idx_tool_invocations_agent_run_id ON tool_invocations(agent_run_id);
CREATE INDEX idx_tool_invocations_tool ON tool_invocations(tool);
CREATE INDEX idx_tool_invocations_status ON tool_invocations(status);
CREATE INDEX idx_tool_invocations_created_at ON tool_invocations(created_at DESC);

-- RLS for tool_invocations
ALTER TABLE tool_invocations ENABLE ROW LEVEL SECURITY;

-- Users can view tool invocations for their agent runs
CREATE POLICY "Users can view own tool invocations"
  ON tool_invocations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agent_runs ar
      JOIN workflow_runs wr ON wr.id = ar.workflow_run_id
      JOIN workflows w ON w.id = wr.workflow_id
      WHERE ar.id = tool_invocations.agent_run_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can create tool invocations for their agent runs
CREATE POLICY "Users can create tool invocations"
  ON tool_invocations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent_runs ar
      JOIN workflow_runs wr ON wr.id = ar.workflow_run_id
      JOIN workflows w ON w.id = wr.workflow_id
      WHERE ar.id = tool_invocations.agent_run_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can update tool invocations for their agent runs
CREATE POLICY "Users can update own tool invocations"
  ON tool_invocations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM agent_runs ar
      JOIN workflow_runs wr ON wr.id = ar.workflow_run_id
      JOIN workflows w ON w.id = wr.workflow_id
      WHERE ar.id = tool_invocations.agent_run_id
      AND w.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent_runs ar
      JOIN workflow_runs wr ON wr.id = ar.workflow_run_id
      JOIN workflows w ON w.id = wr.workflow_id
      WHERE ar.id = tool_invocations.agent_run_id
      AND w.owner_id = auth.uid()
    )
  );

-- Admins can view all tool invocations
CREATE POLICY "Admins can view all tool invocations"
  ON tool_invocations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- TRIGGERS for updated_at
-- ============================================================================

-- Trigger for workflow_runs
CREATE TRIGGER update_workflow_runs_updated_at
  BEFORE UPDATE ON workflow_runs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for agent_runs
CREATE TRIGGER update_agent_runs_updated_at
  BEFORE UPDATE ON agent_runs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for tool_invocations
CREATE TRIGGER update_tool_invocations_updated_at
  BEFORE UPDATE ON tool_invocations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE workflow_runs IS 'Execution history of workflows';
COMMENT ON TABLE agent_runs IS 'Individual agent executions within workflow runs';
COMMENT ON TABLE tool_invocations IS 'Log of all tool calls made by agents during execution';
COMMENT ON COLUMN workflow_runs.input IS 'Initial input provided to the workflow';
COMMENT ON COLUMN workflow_runs.output IS 'Final output produced by the workflow';
COMMENT ON COLUMN agent_runs.step_order IS 'Order of this agent step in the workflow (1, 2, 3, ...)';
COMMENT ON COLUMN agent_runs.input IS 'Input for this agent (from previous step or initial)';
COMMENT ON COLUMN agent_runs.output IS 'Output from this agent (becomes input for next step)';
COMMENT ON COLUMN tool_invocations.tool IS 'Tool ID (e.g., web_search, email, calendar, db_ops)';
COMMENT ON COLUMN tool_invocations.params IS 'Tool parameters as JSON';
COMMENT ON COLUMN tool_invocations.result IS 'Tool execution result as JSON (if successful)';

