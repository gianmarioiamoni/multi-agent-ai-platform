-- Multi-Agent AI Platform - Stored Credentials Migration
-- Sprint 3, Week 6: Calendar tool with Google OAuth
-- Stores encrypted OAuth tokens and API keys for user integrations

-- ============================================================================
-- STORED_CREDENTIALS TABLE
-- ============================================================================
-- Stores encrypted credentials for third-party integrations (Google Calendar, etc.)

CREATE TABLE IF NOT EXISTS stored_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'google_calendar', 'gmail', etc.
  
  -- Encrypted credential data (JSON)
  -- For Google OAuth: { access_token, refresh_token, expires_at, scope }
  encrypted_data BYTEA NOT NULL,
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  scopes TEXT[], -- Array of OAuth scopes
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- One credential per user/provider combination
  UNIQUE(user_id, provider)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_stored_credentials_user_id ON stored_credentials(user_id);

-- Index for active credentials lookup
CREATE INDEX IF NOT EXISTS idx_stored_credentials_active ON stored_credentials(user_id, provider, is_active) 
WHERE is_active = true;

-- Index for expiry cleanup
CREATE INDEX IF NOT EXISTS idx_stored_credentials_expires_at ON stored_credentials(expires_at) 
WHERE expires_at IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE stored_credentials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own credentials
CREATE POLICY "Users can read own credentials"
  ON stored_credentials
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own credentials
CREATE POLICY "Users can insert own credentials"
  ON stored_credentials
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own credentials
CREATE POLICY "Users can update own credentials"
  ON stored_credentials
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own credentials
CREATE POLICY "Users can delete own credentials"
  ON stored_credentials
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Admins can read all credentials (for debugging/monitoring)
CREATE POLICY "Admins can read all credentials"
  ON stored_credentials
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_stored_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update updated_at on stored_credentials
CREATE TRIGGER update_stored_credentials_updated_at
  BEFORE UPDATE ON stored_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_stored_credentials_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE stored_credentials IS 'Encrypted OAuth tokens and API keys for third-party integrations';
COMMENT ON COLUMN stored_credentials.provider IS 'Integration provider identifier (e.g., google_calendar, gmail)';
COMMENT ON COLUMN stored_credentials.encrypted_data IS 'Encrypted credential data stored as BYTEA';
COMMENT ON COLUMN stored_credentials.scopes IS 'OAuth scopes granted for this credential';
COMMENT ON COLUMN stored_credentials.is_active IS 'Whether this credential is currently active';

