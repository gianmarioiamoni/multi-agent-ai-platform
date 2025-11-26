/**
 * Migration: Add is_disabled flag to profiles table
 * 
 * This allows admins to disable/enable user accounts.
 * Disabled users cannot log in and will see an appropriate message.
 */

-- Add is_disabled column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_disabled BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster queries on disabled status
CREATE INDEX IF NOT EXISTS idx_profiles_is_disabled ON profiles(is_disabled);

-- Add comment
COMMENT ON COLUMN profiles.is_disabled IS 'If true, the user account is disabled and cannot log in';

-- Update RLS policies to allow admins to update is_disabled
-- Admins can update any user's disabled status
-- Drop policy if it exists (for idempotency)
DROP POLICY IF EXISTS "Admins can update user disabled status" ON profiles;

-- Create the policy
CREATE POLICY "Admins can update user disabled status"
ON profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

