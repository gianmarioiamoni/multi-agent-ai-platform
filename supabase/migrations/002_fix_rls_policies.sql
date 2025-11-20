-- Fix RLS Policies - Remove Infinite Recursion
-- Sprint 1: Fix for policy causing infinite loop

-- ============================================================================
-- REMOVE PROBLEMATIC POLICIES
-- ============================================================================

-- Drop the recursive admin policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- ============================================================================
-- CREATE HELPER FUNCTION
-- ============================================================================

-- Function to check if current user is admin without causing recursion
-- Uses SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN user_role = 'admin';
END;
$$;

-- ============================================================================
-- RECREATE POLICIES WITHOUT RECURSION
-- ============================================================================

-- Policy: Admins can read all profiles (using helper function)
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  USING (public.is_admin());

-- Policy: Admins can update any profile (using helper function)
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  USING (public.is_admin());

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION public.is_admin() IS 'Check if current user has admin role. Uses SECURITY DEFINER to avoid RLS recursion.';

