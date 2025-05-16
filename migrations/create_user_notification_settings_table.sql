-- Create user notification settings table
CREATE TABLE IF NOT EXISTS user_notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  push_notifications BOOLEAN NOT NULL DEFAULT false,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  badge_notifications BOOLEAN NOT NULL DEFAULT true,
  donation_notifications BOOLEAN NOT NULL DEFAULT true,
  system_notifications BOOLEAN NOT NULL DEFAULT true,
  achievement_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_notification_settings_user_id_key UNIQUE (user_id)
);

-- Add RLS policies
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own settings
CREATE POLICY user_notification_settings_user_policy ON user_notification_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- Policy for service role to manage all settings
CREATE POLICY user_notification_settings_service_policy ON user_notification_settings
  FOR ALL
  USING (auth.role() = 'service_role');
