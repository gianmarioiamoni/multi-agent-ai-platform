-- Migration: Add subscription fields to profiles table
-- Adds support for subscription plans and expiry dates

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_plan TEXT CHECK (subscription_plan IN ('trial', 'basic', 'premium')),
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_used BOOLEAN DEFAULT false;

-- Create index for subscription queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_expires_at ON profiles(subscription_expires_at) WHERE subscription_expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_profiles_trial_used ON profiles(trial_used);

-- Add comment to explain subscription fields
COMMENT ON COLUMN profiles.subscription_plan IS 'Subscription plan: trial (30 days free), basic (€9.90/month or €99/year), premium (€19.90/month or €199/year). NULL for admin users (unlimited access).';
COMMENT ON COLUMN profiles.subscription_expires_at IS 'Date when the subscription expires. NULL for admin users, demo users, or expired subscriptions.';
COMMENT ON COLUMN profiles.trial_used IS 'Whether the user has already used their free trial. Prevents re-activating trial after expiry.';

-- Update existing users: assign trial to regular users only
-- Set trial expiry to 30 days from TODAY (not from creation date)
UPDATE profiles
SET 
  subscription_plan = 'trial',
  subscription_expires_at = NOW() + INTERVAL '30 days',
  trial_used = false
WHERE subscription_plan IS NULL 
  AND role = 'user'
  AND is_demo = false;

-- Mark trial as used if trial already expired
UPDATE profiles
SET 
  trial_used = true
WHERE subscription_plan = 'trial'
  AND subscription_expires_at IS NOT NULL
  AND subscription_expires_at < NOW();

-- Admin users: no subscription (unlimited access)
UPDATE profiles
SET 
  subscription_plan = NULL,
  subscription_expires_at = NULL,
  trial_used = false
WHERE role = 'admin';

-- Demo users should not have subscription info
UPDATE profiles
SET 
  subscription_plan = NULL,
  subscription_expires_at = NULL,
  trial_used = false
WHERE is_demo = true;

