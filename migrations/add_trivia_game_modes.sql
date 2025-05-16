-- Add game_mode column to trivia_attempts
ALTER TABLE trivia_attempts
ADD COLUMN IF NOT EXISTS game_mode TEXT CHECK (game_mode IN ('normal', 'challenge', 'study'));

-- Create trivia_answers table for tracking individual answers
CREATE TABLE IF NOT EXISTS trivia_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES trivia_attempts(id),
  question_number INT NOT NULL,
  answer_time DECIMAL(5,2) NOT NULL, -- Time in seconds with 2 decimal places
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add constraints
  CONSTRAINT answer_time_positive CHECK (answer_time >= 0)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS trivia_answers_attempt_id_idx ON trivia_answers(attempt_id);

-- Add new badge types
INSERT INTO badge_types (type, name, description)
VALUES 
  ('speed-demon', 'Speed Demon', 'Answer 10 questions in under 5 seconds each'),
  ('challenge-champion', 'Challenge Champion', 'Complete a perfect round in Challenge Mode')
ON CONFLICT (type) DO NOTHING;

-- Update trivia leaderboard view to include game mode stats
CREATE OR REPLACE VIEW trivia_leaderboard AS
SELECT 
  u.id as user_id,
  u.name,
  u.avatar_url,
  COUNT(ta.id) as attempts_count,
  SUM(ta.score) as total_correct_answers,
  SUM(ta.total_questions) as total_questions,
  ROUND((SUM(ta.score)::float / NULLIF(SUM(ta.total_questions), 0)) * 100, 1) as accuracy_percent,
  COUNT(CASE WHEN ta.game_mode = 'challenge' AND ta.score = ta.total_questions THEN 1 END) as perfect_challenge_rounds,
  (
    SELECT COUNT(*)
    FROM trivia_answers ta2
    WHERE ta2.attempt_id IN (SELECT id FROM trivia_attempts WHERE user_id = u.id)
    AND ta2.answer_time < 5
    AND ta2.is_correct = true
  ) as fast_correct_answers,
  MAX(ta.created_at) as last_attempt_at
FROM 
  users u
LEFT JOIN 
  trivia_attempts ta ON u.id = ta.user_id
GROUP BY 
  u.id, u.name, u.avatar_url
ORDER BY 
  total_correct_answers DESC;

-- Function to check and award speed demon badge
CREATE OR REPLACE FUNCTION check_speed_demon_badge() RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has 10 fast correct answers
  IF (
    SELECT COUNT(*)
    FROM trivia_answers ta
    JOIN trivia_attempts t ON ta.attempt_id = t.id
    WHERE t.user_id = NEW.user_id
    AND ta.answer_time < 5
    AND ta.is_correct = true
  ) >= 10 THEN
    -- Award badge if not already awarded
    INSERT INTO badges (user_id, badge_type)
    VALUES (NEW.user_id, 'speed-demon')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check and award challenge champion badge
CREATE OR REPLACE FUNCTION check_challenge_champion_badge() RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is a perfect challenge round
  IF NEW.game_mode = 'challenge' AND NEW.score = NEW.total_questions THEN
    -- Award badge if not already awarded
    INSERT INTO badges (user_id, badge_type)
    VALUES (NEW.user_id, 'challenge-champion')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for badge checks
DROP TRIGGER IF EXISTS check_speed_demon_trigger ON trivia_answers;
CREATE TRIGGER check_speed_demon_trigger
AFTER INSERT ON trivia_answers
FOR EACH ROW
EXECUTE FUNCTION check_speed_demon_badge();

DROP TRIGGER IF EXISTS check_challenge_champion_trigger ON trivia_attempts;
CREATE TRIGGER check_challenge_champion_trigger
AFTER INSERT ON trivia_attempts
FOR EACH ROW
EXECUTE FUNCTION check_challenge_champion_badge(); 