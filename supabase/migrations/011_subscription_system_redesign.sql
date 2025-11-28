-- Migration: Subscription System Redesign
-- Adds fields to support advanced subscription management:
-- - Trial days remaining tracking
-- - Plan switching (change plan at end of current period)
-- - Subscription cancellation tracking

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trial_days_remaining INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS next_plan TEXT CHECK (next_plan IN ('trial', 'basic', 'premium')),
ADD COLUMN IF NOT EXISTS plan_switch_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_cancelled_at TIMESTAMPTZ;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_trial_days_remaining ON profiles(trial_days_remaining) WHERE trial_days_remaining > 0;
CREATE INDEX IF NOT EXISTS idx_profiles_next_plan ON profiles(next_plan) WHERE next_plan IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_plan_switch_at ON profiles(plan_switch_at) WHERE plan_switch_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_cancelled_at ON profiles(subscription_cancelled_at) WHERE subscription_cancelled_at IS NOT NULL;

-- Add comments
COMMENT ON COLUMN profiles.trial_days_remaining IS 'Days remaining from trial when user subscribed to paid plan. Used for returning to trial after cancellation.';
COMMENT ON COLUMN profiles.next_plan IS 'Plan that will be activated at the end of current paid period (for plan switching).';
COMMENT ON COLUMN profiles.plan_switch_at IS 'Date when plan switch will occur (end of current paid period).';
COMMENT ON COLUMN profiles.subscription_cancelled_at IS 'Date when user cancelled their paid subscription. Used to determine behavior at expiry.';

-- Initialize trial_days_remaining for existing trial users
-- Calculate remaining days from subscription_expires_at
UPDATE profiles
SET trial_days_remaining = GREATEST(0, EXTRACT(EPOCH FROM (subscription_expires_at - NOW())) / 86400)::INTEGER
WHERE subscription_plan = 'trial'
  AND subscription_expires_at IS NOT NULL
  AND subscription_expires_at > NOW();

-- Set trial_days_remaining to 0 for expired trials
UPDATE profiles
SET trial_days_remaining = 0
WHERE subscription_plan = 'trial'
  AND (subscription_expires_at IS NULL OR subscription_expires_at <= NOW());

-- Clear next_plan and plan_switch_at for existing records (no pending switches)
UPDATE profiles
SET 
  next_plan = NULL,
  plan_switch_at = NULL,
  subscription_cancelled_at = NULL
WHERE next_plan IS NOT NULL OR plan_switch_at IS NOT NULL OR subscription_cancelled_at IS NOT NULL;

