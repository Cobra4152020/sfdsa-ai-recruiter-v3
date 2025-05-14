-- Create a view for the leaderboard
CREATE OR REPLACE VIEW leaderboard_view AS
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
  users u;

-- Create a view for daily leaderboard
CREATE OR REPLACE VIEW leaderboard_daily_view AS
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

-- Create a view for weekly leaderboard
CREATE OR REPLACE VIEW leaderboard_weekly_view AS
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

-- Create a view for monthly leaderboard
CREATE OR REPLACE VIEW leaderboard_monthly_view AS
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
