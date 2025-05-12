-- Add metadata column to social_shares table for storing animation preferences and other data
ALTER TABLE social_shares ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create index on content_type for queries
CREATE INDEX IF NOT EXISTS idx_social_shares_content_type ON social_shares (content_type);

-- Create index on platform for queries
CREATE INDEX IF NOT EXISTS idx_social_shares_platform ON social_shares (platform);

-- Add comment on column
COMMENT ON COLUMN social_shares.metadata IS 'Additional metadata such as animation settings, device info, etc.';
