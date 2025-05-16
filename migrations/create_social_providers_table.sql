-- Create table for tracking user social providers
CREATE TABLE IF NOT EXISTS user_social_providers (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider),
  UNIQUE(provider, provider_id)
);

-- Add social_provider column to recruit.users table
ALTER TABLE recruit.users ADD COLUMN IF NOT EXISTS social_provider VARCHAR(50);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_social_providers_user_id ON user_social_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_providers_provider ON user_social_providers(provider);
