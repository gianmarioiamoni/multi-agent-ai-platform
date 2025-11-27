-- Migration: Add tool_configs table for global tool configuration
-- Sprint 4, Week 8: Production configuration management
-- Allows admin to configure tools (Email, Web Search, OpenAI) via UI instead of env vars

-- Create tool_configs table
CREATE TABLE IF NOT EXISTS tool_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id TEXT NOT NULL UNIQUE, -- 'email', 'web_search', 'openai'
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES profiles(user_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE tool_configs IS 'Global tool configurations managed by admin. Replaces env vars in production.';
COMMENT ON COLUMN tool_configs.tool_id IS 'Identifier for the tool: email, web_search, openai';
COMMENT ON COLUMN tool_configs.config IS 'Tool-specific configuration stored as JSONB';
COMMENT ON COLUMN tool_configs.enabled IS 'Whether this tool is enabled for use';
COMMENT ON COLUMN tool_configs.updated_by IS 'Admin user who last updated this configuration';

-- Create index on tool_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_tool_configs_tool_id ON tool_configs(tool_id);

-- Create index on enabled for filtering
CREATE INDEX IF NOT EXISTS idx_tool_configs_enabled ON tool_configs(enabled) WHERE enabled = true;

-- Enable RLS
ALTER TABLE tool_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can read tool_configs
CREATE POLICY "Only admins can read tool_configs"
  ON tool_configs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policy: Only admins can insert tool_configs
CREATE POLICY "Only admins can insert tool_configs"
  ON tool_configs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policy: Only admins can update tool_configs
CREATE POLICY "Only admins can update tool_configs"
  ON tool_configs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policy: Only admins can delete tool_configs
CREATE POLICY "Only admins can delete tool_configs"
  ON tool_configs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tool_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_tool_configs_updated_at
  BEFORE UPDATE ON tool_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_configs_updated_at();

-- Grant service role full access (for server-side operations)
GRANT ALL ON tool_configs TO service_role;

