-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx ON push_subscriptions(user_id);

-- Add RLS policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own subscriptions
CREATE POLICY push_subscriptions_user_policy ON push_subscriptions
  FOR ALL
  USING (auth.uid() = user_id);

-- Policy for service role to manage all subscriptions
CREATE POLICY push_subscriptions_service_policy ON push_subscriptions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
