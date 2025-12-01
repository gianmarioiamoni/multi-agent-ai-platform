-- Migration: Add Stripe fields to profiles table
-- Adds fields for Stripe customer ID, subscription ID, and price ID tracking

-- Add Stripe-related columns
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Create indexes for Stripe lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- Comments
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe Customer ID for this user';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Stripe Subscription ID for active subscription';
COMMENT ON COLUMN profiles.stripe_price_id IS 'Stripe Price ID of the current subscription';

