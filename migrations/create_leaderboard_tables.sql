-- Create user_point_logs table for anti-cheating measures
CREATE TABLE IF NOT EXISTS user_point_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS user_point_logs_user_id_idx ON user_point_logs(user_id);
CREATE INDEX IF NOT EXISTS user_point_logs_created_at_idx ON user_point_logs(created_at);

-- Add avatar_url and bio columns to users table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
    ALTER TABLE users ADD COLUMN avatar_url TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
    ALTER TABLE users ADD COLUMN bio TEXT;
  END IF;
END $$;

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

-- Create materialized view for leaderboard performance optimization
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_cache AS
SELECT
  u.id,
  u.name,
  u.avatar_url,
  u.bio,
  u.participation_count,
  u.has_applied,
  (SELECT COUNT(*) FROM badges b WHERE b.user_id = u.id) AS badge_count,
  (SELECT COUNT(*) FROM user_nft_awards n WHERE n.user_id = u.id) AS nft_count,
  ROW_NUMBER() OVER (ORDER BY u.participation_count DESC) AS rank
FROM
  users u
WHERE
  u.participation_count > 0;

-- Create index on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_cache_id_idx ON leaderboard_cache(id);
CREATE INDEX IF NOT EXISTS leaderboard_cache_rank_idx ON leaderboard_cache(rank);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_leaderboard_cache()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_cache;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh the materialized view when users are updated
CREATE TRIGGER refresh_leaderboard_cache_trigger
AFTER INSERT OR UPDATE OF participation_count, has_applied ON users
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard_cache();

-- Create daily, weekly, and monthly materialized views for different timeframes
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_daily_cache AS
SELECT
  u.id,
  u.name,
  u.avatar_url,
  u.bio,
  u.participation_count,
  u.has_applied,
  (SELECT COUNT(*) FROM badges b WHERE b.user_id = u.id AND b.earned_at > NOW() - INTERVAL '1 day') AS badge_count,
  (SELECT COUNT(*) FROM user_nft_awards n WHERE n.user_id = u.id AND n.awarded_at > NOW() - INTERVAL '1 day') AS nft_count,
  ROW_NUMBER() OVER (ORDER BY u.participation_count DESC) AS rank
FROM
  users u
WHERE
  u.created_at > NOW() - INTERVAL '1 day';

CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_weekly_cache AS
SELECT
  u.id,
  u.name,
  u.avatar_url,
  u.bio,
  u.participation_count,
  u.has_applied,
  (SELECT COUNT(*) FROM badges b WHERE b.user_id = u.id AND b.earned_at > NOW() - INTERVAL '7 days') AS badge_count,
  (SELECT COUNT(*) FROM user_nft_awards n WHERE n.user_id = u.id AND n.awarded_at > NOW() - INTERVAL '7 days') AS nft_count,
  ROW_NUMBER() OVER (ORDER BY u.participation_count DESC) AS rank
FROM
  users u
WHERE
  u.created_at > NOW() - INTERVAL '7 days';

CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_monthly_cache AS
SELECT
  u.id,
  u.name,
  u.avatar_url,
  u.bio,
  u.participation_count,
  u.has_applied,
  (SELECT COUNT(*) FROM badges b WHERE b.user_id = u.id AND b.earned_at > NOW() - INTERVAL '30 days') AS badge_count,
  (SELECT COUNT(*) FROM user_nft_awards n WHERE n.user_id = u.id AND n.awarded_at > NOW() - INTERVAL '30 days') AS nft_count,
  ROW_NUMBER() OVER (ORDER BY u.participation_count DESC) AS rank
FROM
  users u
WHERE
  u.created_at > NOW() - INTERVAL '30 days';

-- Create indexes on the timeframe materialized views
CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_daily_cache_id_idx ON leaderboard_daily_cache(id);
CREATE INDEX IF NOT EXISTS leaderboard_daily_cache_rank_idx ON leaderboard_daily_cache(rank);

CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_weekly_cache_id_idx ON leaderboard_weekly_cache(id);
CREATE INDEX IF NOT EXISTS leaderboard_weekly_cache_rank_idx ON leaderboard_weekly_cache(rank);

CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_monthly_cache_id_idx ON leaderboard_monthly_cache(id);
CREATE INDEX IF NOT EXISTS leaderboard_monthly_cache_rank_idx ON leaderboard_monthly_cache(rank);

-- Create a scheduled function to refresh the materialized views
CREATE OR REPLACE FUNCTION refresh_all_leaderboard_caches()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_cache;
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_daily_cache;
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_weekly_cache;
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_monthly_cache;
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to refresh the materialized views (if pg_cron extension is available)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('refresh_leaderboard_caches', '*/15 * * * *', 'SELECT refresh_all_leaderboard_caches()');
  END IF;
END $$;
