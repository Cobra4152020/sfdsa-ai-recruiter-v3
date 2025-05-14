-- Create push notification queue table
CREATE TABLE IF NOT EXISTS push_notification_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES push_subscriptions(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS push_notification_queue_status_idx ON push_notification_queue(status);
CREATE INDEX IF NOT EXISTS push_notification_queue_subscription_id_idx ON push_notification_queue(subscription_id);

-- Add RLS policies
ALTER TABLE push_notification_queue ENABLE ROW LEVEL SECURITY;

-- Only allow the service role to access this table
CREATE POLICY push_notification_queue_service_policy ON push_notification_queue 
  USING (auth.role() = 'service_role');
