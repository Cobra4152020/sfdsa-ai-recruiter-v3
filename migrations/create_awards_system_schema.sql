-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  participation_count INTEGER NOT NULL DEFAULT 0,
  has_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create badge types enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'badge_type') THEN
    CREATE TYPE badge_type AS ENUM (
      'written', 'oral', 'physical', 'polygraph', 'psychological', 'full',
      'chat-participation', 'first-response', 'application-started', 'application-completed',
      'frequent-user', 'resource-downloader', 'hard-charger', 'connector',
      'deep-diver', 'quick-learner', 'persistent-explorer', 'dedicated-applicant'
    );
  END IF;
END$$;

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only have one of each badge type
  UNIQUE(user_id, badge_type)
);

-- Create NFT award tiers table
CREATE TABLE IF NOT EXISTS nft_award_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  point_threshold INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user NFT awards table
CREATE TABLE IF NOT EXISTS user_nft_awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nft_award_id TEXT NOT NULL REFERENCES nft_award_tiers(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_at_award INTEGER NOT NULL,
  token_id TEXT,
  contract_address TEXT,
  transaction_hash TEXT,
  
  -- Ensure a user can only have one of each NFT award
  UNIQUE(user_id, nft_award_id)
);

-- Create user point logs table for anti-cheating measures
CREATE TABLE IF NOT EXISTS user_point_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user engagement metrics table for tracking engagement
CREATE TABLE IF NOT EXISTS user_engagement_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_views INTEGER NOT NULL DEFAULT 0,
  chat_interactions INTEGER NOT NULL DEFAULT 0,
  resource_downloads INTEGER NOT NULL DEFAULT 0,
  quiz_completions INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per user
  UNIQUE(user_id)
);

-- Create badge sharing table to track badge shares
CREATE TABLE IF NOT EXISTS badge_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- e.g., 'twitter', 'facebook', 'linkedin'
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS badges_user_id_idx ON badges(user_id);
CREATE INDEX IF NOT EXISTS badges_badge_type_idx ON badges(badge_type);
CREATE INDEX IF NOT EXISTS badges_earned_at_idx ON badges(earned_at DESC);

CREATE INDEX IF NOT EXISTS user_nft_awards_user_id_idx ON user_nft_awards(user_id);
CREATE INDEX IF NOT EXISTS user_nft_awards_nft_award_id_idx ON user_nft_awards(nft_award_id);
CREATE INDEX IF NOT EXISTS user_nft_awards_awarded_at_idx ON user_nft_awards(awarded_at DESC);

CREATE INDEX IF NOT EXISTS user_point_logs_user_id_idx ON user_point_logs(user_id);
CREATE INDEX IF NOT EXISTS user_point_logs_created_at_idx ON user_point_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS user_engagement_metrics_user_id_idx ON user_engagement_metrics(user_id);
CREATE INDEX IF NOT EXISTS user_engagement_metrics_last_active_at_idx ON user_engagement_metrics(last_active_at DESC);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at column
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to check and award NFTs when participation points increase
CREATE OR REPLACE FUNCTION check_and_award_nfts()
RETURNS TRIGGER AS $$
DECLARE
  award_record RECORD;
BEGIN
  -- Only proceed if participation count has increased
  IF NEW.participation_count <= OLD.participation_count THEN
    RETURN NEW;
  END IF;
  
  -- Check each award tier
  FOR award_record IN 
    SELECT * FROM nft_award_tiers 
    WHERE point_threshold <= NEW.participation_count
    ORDER BY point_threshold DESC
  LOOP
    -- Check if user already has this award
    IF NOT EXISTS (
      SELECT 1 FROM user_nft_awards 
      WHERE user_id = NEW.id AND nft_award_id = award_record.id
    ) THEN
      -- Award the NFT
      INSERT INTO user_nft_awards (
        user_id, 
        nft_award_id, 
        points_at_award
      ) VALUES (
        NEW.id,
        award_record.id,
        NEW.participation_count
      );
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check and award NFTs when user is updated
CREATE TRIGGER check_nft_awards_on_user_update
AFTER UPDATE OF participation_count ON users
FOR EACH ROW
WHEN (NEW.participation_count > OLD.participation_count)
EXECUTE FUNCTION check_and_award_nfts();

-- Create function to detect suspicious activity
CREATE OR REPLACE FUNCTION check_suspicious_activity()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
  total_points INTEGER;
BEGIN
  -- Check for too many updates in a short time
  SELECT COUNT(*) INTO recent_count
  FROM user_point_logs
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '5 minutes';
  
  IF recent_count > 10 THEN
    RAISE EXCEPTION 'Too many point updates in a short time';
  END IF;
  
  -- Check for unusually large point increases
  IF NEW.points > 100 THEN
    RAISE EXCEPTION 'Point update exceeds maximum allowed';
  END IF;
  
  -- Check for total points gained in a day
  SELECT COALESCE(SUM(points), 0) INTO total_points
  FROM user_point_logs
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '1 day';
  
  IF total_points + NEW.points > 1000 THEN
    RAISE EXCEPTION 'Daily point limit exceeded';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check for suspicious activity
CREATE TRIGGER check_suspicious_activity_trigger
BEFORE INSERT ON user_point_logs
FOR EACH ROW
EXECUTE FUNCTION check_suspicious_activity();

-- Comments for documentation
COMMENT ON TABLE badges IS 'Stores badges earned by users';
COMMENT ON TABLE nft_award_tiers IS 'Defines the different NFT award tiers available';
COMMENT ON TABLE user_nft_awards IS 'Tracks NFT awards earned by users';
COMMENT ON TABLE user_point_logs IS 'Logs point transactions for anti-cheating measures';
COMMENT ON TABLE user_engagement_metrics IS 'Tracks user engagement with the platform';
COMMENT ON TABLE badge_shares IS 'Tracks when users share their badges on social media';
