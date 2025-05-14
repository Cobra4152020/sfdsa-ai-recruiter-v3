-- Add TikTok as a platform option and add video_url column
ALTER TABLE social_shares 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_duration INTEGER;

-- Update the metadata column to include TikTok-specific information
COMMENT ON COLUMN social_shares.metadata IS 'JSON metadata for the share, including platform-specific details like animation settings, video quality, etc.';

-- Create an index on the platform column for faster queries
CREATE INDEX IF NOT EXISTS idx_social_shares_platform ON social_shares(platform);

-- Add a function to track TikTok shares
CREATE OR REPLACE FUNCTION track_tiktok_share()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a TikTok share, update user points
  IF NEW.platform = 'tiktok' THEN
    -- Award 30 points for TikTok shares (slightly more than other platforms)
    INSERT INTO user_points (user_id, points, reason, metadata)
    VALUES (
      NEW.user_id, 
      30, 
      'tiktok_share', 
      jsonb_build_object(
        'content_type', NEW.content_type,
        'content_id', NEW.content_id,
        'content_title', NEW.content_title
      )
    );
    
    -- Check if user qualifies for the social media badge
    PERFORM check_and_award_social_media_badge(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for TikTok shares
DROP TRIGGER IF EXISTS tiktok_share_trigger ON social_shares;
CREATE TRIGGER tiktok_share_trigger
AFTER INSERT ON social_shares
FOR EACH ROW
WHEN (NEW.platform = 'tiktok')
EXECUTE FUNCTION track_tiktok_share();

-- Create a function to check and award social media badge
CREATE OR REPLACE FUNCTION check_and_award_social_media_badge(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
  share_count INTEGER;
  platform_count INTEGER;
BEGIN
  -- Count total shares
  SELECT COUNT(*) INTO share_count
  FROM social_shares
  WHERE user_id = user_id_param;
  
  -- Count unique platforms
  SELECT COUNT(DISTINCT platform) INTO platform_count
  FROM social_shares
  WHERE user_id = user_id_param;
  
  -- Award badge if user has shared on at least 3 different platforms and has at least 5 total shares
  IF platform_count >= 3 AND share_count >= 5 THEN
    -- Check if user already has the badge
    IF NOT EXISTS (
      SELECT 1 FROM user_badges 
      WHERE user_id = user_id_param AND badge_id = 'social_media_master'
    ) THEN
      -- Award the badge
      INSERT INTO user_badges (user_id, badge_id, awarded_at, metadata)
      VALUES (
        user_id_param, 
        'social_media_master', 
        NOW(), 
        jsonb_build_object(
          'platforms', (SELECT array_agg(DISTINCT platform) FROM social_shares WHERE user_id = user_id_param),
          'share_count', share_count
        )
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;
