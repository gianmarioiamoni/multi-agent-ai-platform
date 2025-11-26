-- Migration: Add Demo User Flag
-- Adds is_demo boolean field to profiles table to mark demo accounts
-- Admin can set/unset this flag via UI

-- ============================================================================
-- ADD is_demo COLUMN
-- ============================================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- ============================================================================
-- INDEX
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_is_demo ON profiles(is_demo);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON COLUMN profiles.is_demo IS 'Flag to mark demo accounts. Demo users cannot change password or delete account.';

