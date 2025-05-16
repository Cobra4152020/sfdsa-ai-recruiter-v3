-- Create social shares table to track user sharing activity
CREATE TABLE IF NOT EXISTS social_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  content_title TEXT,
  shared_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for common queries
  CONSTRAINT social_shares_user_platform_idx UNIQUE (user_id, platform, content_type, created_at)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS social_shares_user_id_idx ON social_shares(user_id);
CREATE INDEX IF NOT EXISTS social_shares_platform_idx ON social_shares(platform);
CREATE INDEX IF NOT EXISTS social_shares_content_type_idx ON social_shares(content_type);
CREATE INDEX IF NOT EXISTS social_shares_created_at_idx ON social_shares(created_at);

-- Add RLS policies
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

-- Admin can see all shares
CREATE POLICY admin_all_social_shares ON social_shares
  FOR ALL USING (
    (SELECT is_admin FROM user_roles WHERE user_id = auth.uid())
  );

-- Users can see their own shares
CREATE POLICY user_own_social_shares ON social_shares
  FOR SELECT USING (user_id = auth.uid());

-- Service role can do everything
CREATE POLICY service_role_social_shares ON social_shares
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
