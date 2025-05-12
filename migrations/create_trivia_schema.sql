-- Create trivia attempts table
CREATE TABLE IF NOT EXISTS trivia_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  score INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add constraints
  CONSTRAINT score_range CHECK (score >= 0 AND score <= total_questions)
);

-- Create chat interactions table
CREATE TABLE IF NOT EXISTS chat_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS trivia_attempts_user_id_idx ON trivia_attempts(user_id);
CREATE INDEX IF NOT EXISTS chat_interactions_user_id_idx ON chat_interactions(user_id);

-- Create function to add participation points
CREATE OR REPLACE FUNCTION add_participation_points(
  user_id_param UUID,
  points_param INT,
  activity_type_param TEXT,
  description_param TEXT
) RETURNS VOID AS $$
BEGIN
  -- Record the activity
  INSERT INTO user_activities (
    user_id, 
    activity_type, 
    description, 
    points, 
    created_at
  ) VALUES (
    user_id_param,
    activity_type_param,
    description_param,
    points_param,
    NOW()
  );
  
  -- Update the user's total participation count
  UPDATE users
  SET participation_count = participation_count + points_param
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Add view for trivia leaderboard
CREATE OR REPLACE VIEW trivia_leaderboard AS
SELECT 
  u.id as user_id,
  u.name,
  u.avatar_url,
  COUNT(ta.id) as attempts_count,
  SUM(ta.score) as total_correct_answers,
  SUM(ta.total_questions) as total_questions,
  ROUND((SUM(ta.score)::float / NULLIF(SUM(ta.total_questions), 0)) * 100, 1) as accuracy_percent,
  MAX(ta.created_at) as last_attempt_at
FROM 
  users u
LEFT JOIN 
  trivia_attempts ta ON u.id = ta.user_id
GROUP BY 
  u.id, u.name, u.avatar_url
ORDER BY 
  total_correct_answers DESC;
