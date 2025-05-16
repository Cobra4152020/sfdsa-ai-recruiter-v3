-- Create TikTok challenges tables
CREATE TABLE IF NOT EXISTS tiktok_challenges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  hashtags TEXT[] NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 50,
  badge_reward VARCHAR(255),
  example_video_url TEXT,
  thumbnail_url TEXT,
  requirements JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create challenge submissions table
CREATE TABLE IF NOT EXISTS tiktok_challenge_submissions (
  id SERIAL PRIMARY KEY,
  challenge_id INTEGER REFERENCES tiktok_challenges(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  tiktok_url TEXT,
  views_count INTEGER,
  likes_count INTEGER,
  comments_count INTEGER,
  shares_count INTEGER,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  admin_feedback TEXT,
  verification_code VARCHAR(50),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tiktok_challenges
CREATE TRIGGER update_tiktok_challenges_timestamp
BEFORE UPDATE ON tiktok_challenges
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_tiktok_challenge_status ON tiktok_challenges(status);
CREATE INDEX IF NOT EXISTS idx_tiktok_challenge_dates ON tiktok_challenges(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tiktok_submission_status ON tiktok_challenge_submissions(status);
CREATE INDEX IF NOT EXISTS idx_tiktok_submission_user ON tiktok_challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_submission_challenge ON tiktok_challenge_submissions(challenge_id);

-- Create view for active challenges
CREATE OR REPLACE VIEW active_tiktok_challenges AS
SELECT *
FROM tiktok_challenges
WHERE status = 'active'
AND start_date <= now()
AND end_date >= now();

-- Create view for challenge leaderboard
CREATE OR REPLACE VIEW tiktok_challenge_leaderboard AS
SELECT 
  u.id AS user_id,
  u.display_name,
  u.avatar_url,
  COUNT(cs.id) AS challenges_completed,
  SUM(c.points_reward) AS total_points,
  JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'challenge_id', c.id,
      'challenge_title', c.title,
      'submission_id', cs.id,
      'video_url', cs.video_url,
      'submitted_at', cs.submitted_at,
      'points', c.points_reward
    )
  ) AS challenge_details
FROM tiktok_challenge_submissions cs
JOIN tiktok_challenges c ON cs.challenge_id = c.id
JOIN users u ON cs.user_id = u.id
WHERE cs.status = 'approved'
GROUP BY u.id, u.display_name, u.avatar_url
ORDER BY total_points DESC, challenges_completed DESC;

-- Function to check if a user has completed a challenge
CREATE OR REPLACE FUNCTION has_completed_challenge(p_user_id VARCHAR, p_challenge_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM tiktok_challenge_submissions
    WHERE user_id = p_user_id
    AND challenge_id = p_challenge_id
    AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get all challenges with completion status for a user
CREATE OR REPLACE FUNCTION get_challenges_with_completion(p_user_id VARCHAR)
RETURNS TABLE (
  id INTEGER,
  title VARCHAR,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  points_reward INTEGER,
  badge_reward VARCHAR,
  status VARCHAR,
  completed BOOLEAN,
  submission_id INTEGER,
  submission_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.start_date,
    c.end_date,
    c.points_reward,
    c.badge_reward,
    c.status,
    CASE WHEN s.id IS NOT NULL AND s.status = 'approved' THEN TRUE ELSE FALSE END as completed,
    s.id as submission_id,
    s.status as submission_status
  FROM tiktok_challenges c
  LEFT JOIN tiktok_challenge_submissions s ON c.id = s.challenge_id AND s.user_id = p_user_id
  WHERE c.status = 'active'
  ORDER BY c.end_date DESC;
END;
$$ LANGUAGE plpgsql;
