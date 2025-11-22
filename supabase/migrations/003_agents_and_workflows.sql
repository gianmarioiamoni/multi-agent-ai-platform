-- Migration: Agents and Workflows Tables
-- Sprint 2, Week 3
-- Creates the core tables for AI agents and workflow orchestration

-- ============================================================================
-- ENUMS
-- ============================================================================

-- AI model options
CREATE TYPE ai_model AS ENUM (
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-3.5-turbo'
);

-- Agent status
CREATE TYPE agent_status AS ENUM (
  'active',
  'inactive',
  'archived'
);

-- Workflow status
CREATE TYPE workflow_status AS ENUM (
  'draft',
  'active',
  'paused',
  'archived'
);

-- ============================================================================
-- AGENTS TABLE
-- ============================================================================

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  
  -- Agent configuration
  role TEXT NOT NULL, -- System prompt / agent role
  model ai_model NOT NULL DEFAULT 'gpt-4o-mini',
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 2000 CHECK (max_tokens > 0),
  
  -- Tools enabled for this agent
  tools_enabled TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['web_search', 'email', 'calendar', 'db_ops']
  
  -- Additional config (JSON)
  config JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  status agent_status NOT NULL DEFAULT 'active',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT name_not_empty CHECK (char_length(name) > 0),
  CONSTRAINT role_not_empty CHECK (char_length(role) > 0)
);

-- Indexes for agents
CREATE INDEX idx_agents_owner_id ON agents(owner_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_created_at ON agents(created_at DESC);

-- RLS for agents
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Users can view their own agents
CREATE POLICY "Users can view own agents"
  ON agents FOR SELECT
  USING (auth.uid() = owner_id);

-- Users can create agents
CREATE POLICY "Users can create own agents"
  ON agents FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Users can update their own agents
CREATE POLICY "Users can update own agents"
  ON agents FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Users can delete their own agents
CREATE POLICY "Users can delete own agents"
  ON agents FOR DELETE
  USING (auth.uid() = owner_id);

-- Admins can view all agents
CREATE POLICY "Admins can view all agents"
  ON agents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- WORKFLOWS TABLE
-- ============================================================================

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  
  -- Workflow definition (graph JSON)
  -- Structure: { steps: [...], edges: [...], triggers: {...} }
  graph JSONB NOT NULL DEFAULT '{
    "steps": [],
    "edges": [],
    "triggers": {}
  }'::jsonb,
  
  -- Status
  status workflow_status NOT NULL DEFAULT 'draft',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_run_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT workflow_name_not_empty CHECK (char_length(name) > 0)
);

-- Indexes for workflows
CREATE INDEX idx_workflows_owner_id ON workflows(owner_id);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_created_at ON workflows(created_at DESC);

-- RLS for workflows
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Users can view their own workflows
CREATE POLICY "Users can view own workflows"
  ON workflows FOR SELECT
  USING (auth.uid() = owner_id);

-- Users can create workflows
CREATE POLICY "Users can create own workflows"
  ON workflows FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Users can update their own workflows
CREATE POLICY "Users can update own workflows"
  ON workflows FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Users can delete their own workflows
CREATE POLICY "Users can delete own workflows"
  ON workflows FOR DELETE
  USING (auth.uid() = owner_id);

-- Admins can view all workflows
CREATE POLICY "Admins can view all workflows"
  ON workflows FOR SELECT
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for agents
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for workflows
CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE agents IS 'AI agents with configurable models, roles, and tools';
COMMENT ON TABLE workflows IS 'Multi-agent workflow definitions with graph structure';
COMMENT ON COLUMN agents.role IS 'System prompt defining the agent role and behavior';
COMMENT ON COLUMN agents.tools_enabled IS 'Array of tool IDs available to this agent';
COMMENT ON COLUMN agents.config IS 'Additional configuration as JSON (extensible)';
COMMENT ON COLUMN workflows.graph IS 'Workflow graph: steps, edges, and triggers';

