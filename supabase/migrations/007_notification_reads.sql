-- Migration: Notification Reads Table
-- Sprint 4, Week 7
-- Creates table to track read status of notifications in the database

-- ============================================================================
-- NOTIFICATION_READS TABLE
-- ============================================================================
-- Tracks which notifications have been read by which users
-- Notification IDs are generated dynamically (e.g., "workflow-{run_id}-completed")
-- so we store them as strings

CREATE TABLE notification_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User who read the notification
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification ID (e.g., "workflow-{run_id}-completed")
  notification_id TEXT NOT NULL,
  
  -- Timestamp
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT notification_id_not_empty CHECK (char_length(notification_id) > 0),
  
  -- Unique constraint: a user can only mark a notification as read once
  UNIQUE(user_id, notification_id)
);

-- Indexes for notification_reads
CREATE INDEX idx_notification_reads_user_id ON notification_reads(user_id);
CREATE INDEX idx_notification_reads_notification_id ON notification_reads(notification_id);
CREATE INDEX idx_notification_reads_read_at ON notification_reads(read_at DESC);
CREATE INDEX idx_notification_reads_user_notification ON notification_reads(user_id, notification_id);

-- RLS for notification_reads
ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;

-- Users can view their own read notifications
CREATE POLICY "Users can view own notification reads"
  ON notification_reads FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own read notifications
CREATE POLICY "Users can create own notification reads"
  ON notification_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all notification reads
CREATE POLICY "Admins can view all notification reads"
  ON notification_reads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE notification_reads IS 'Tracks which notifications have been read by users';
COMMENT ON COLUMN notification_reads.user_id IS 'User who read the notification';
COMMENT ON COLUMN notification_reads.notification_id IS 'Notification identifier (e.g., "workflow-{run_id}-completed")';
COMMENT ON COLUMN notification_reads.read_at IS 'Timestamp when the notification was marked as read';

