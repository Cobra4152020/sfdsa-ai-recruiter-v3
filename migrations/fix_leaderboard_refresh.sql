-- Create a function to refresh all leaderboard views
CREATE OR REPLACE FUNCTION refresh_leaderboard_views()
RETURNS TRIGGER AS $$
BEGIN
  -- Refresh the materialized views if they exist
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'leaderboard_cache') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_cache;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'leaderboard_daily_cache') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_daily_cache;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'leaderboard_weekly_cache') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_weekly_cache;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'leaderboard_monthly_cache') THEN
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_monthly_cache;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger for user creation and updates
DROP TRIGGER IF EXISTS refresh_leaderboard_on_user_change ON users;

CREATE TRIGGER refresh_leaderboard_on_user_change
AFTER INSERT OR UPDATE ON users
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard_views();

-- Create or replace the trigger for badge creation
DROP TRIGGER IF EXISTS refresh_leaderboard_on_badge_change ON badges;

CREATE TRIGGER refresh_leaderboard_on_badge_change
AFTER INSERT OR UPDATE OR DELETE ON badges
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard_views();

-- Create or replace the trigger for NFT award creation
DROP TRIGGER IF EXISTS refresh_leaderboard_on_nft_change ON user_nft_awards;

CREATE TRIGGER refresh_leaderboard_on_nft_change
AFTER INSERT OR UPDATE OR DELETE ON user_nft_awards
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard_views();
