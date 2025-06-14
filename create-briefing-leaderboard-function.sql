-- Create the get_briefing_leaderboard RPC function
CREATE OR REPLACE FUNCTION get_briefing_leaderboard()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  attendance_count BIGINT,
  share_count BIGINT,
  total_points BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    u.id as user_id,
    u.name as username,
    u.avatar_url,
    COALESCE(a.attendance_count, 0) as attendance_count,
    COALESCE(s.share_count, 0) as share_count,
    (COALESCE(a.attendance_count, 0) * 5 + COALESCE(s.share_count, 0) * 10) as total_points
  FROM users u
  LEFT JOIN (
    SELECT user_id, COUNT(*) as attendance_count
    FROM briefing_attendance
    GROUP BY user_id
  ) a ON u.id = a.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as share_count
    FROM briefing_shares
    GROUP BY user_id
  ) s ON u.id = s.user_id
  WHERE u.participation_count > 0 OR a.attendance_count > 0 OR s.share_count > 0
  ORDER BY total_points DESC
  LIMIT 10;
$$;

-- Add comment
COMMENT ON FUNCTION get_briefing_leaderboard() IS 'Returns leaderboard of users based on briefing participation'; 