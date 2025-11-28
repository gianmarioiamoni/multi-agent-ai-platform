-- Migration: Subscription Notification Tracking
-- Creates table to track sent subscription notifications and prevent duplicates

CREATE TABLE IF NOT EXISTS subscription_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('expiring_soon', 'expired', 'disabled')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subscription_expires_at TIMESTAMPTZ, -- For reference
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for subscription_notifications
CREATE INDEX IF NOT EXISTS idx_subscription_notifications_user_id ON subscription_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_notifications_type ON subscription_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_subscription_notifications_sent_at ON subscription_notifications(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_notifications_user_type_expires ON subscription_notifications(user_id, notification_type, subscription_expires_at);

-- RLS for subscription_notifications
ALTER TABLE subscription_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notification records
CREATE POLICY "Users can view own subscription notifications"
  ON subscription_notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert notification records (via service role)
-- RLS is bypassed for service role operations

-- Comments
COMMENT ON TABLE subscription_notifications IS 'Tracks sent subscription notification emails to prevent duplicates';
COMMENT ON COLUMN subscription_notifications.notification_type IS 'Type of notification: expiring_soon (2 days before), expired (at expiry), disabled (when account disabled)';
COMMENT ON COLUMN subscription_notifications.subscription_expires_at IS 'Subscription expiry date at the time notification was sent (for reference)';

