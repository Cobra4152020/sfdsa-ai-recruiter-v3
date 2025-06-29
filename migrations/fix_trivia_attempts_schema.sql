-- Fix trivia_attempts table schema to support all required columns
-- This migration ensures the table has all columns needed by the trivia game API

-- First, create the table if it doesn't exist with minimal schema
CREATE TABLE IF NOT EXISTS trivia_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist
ALTER TABLE trivia_attempts 
ADD COLUMN IF NOT EXISTS game_id TEXT,
ADD COLUMN IF NOT EXISTS correct_answers INTEGER,
ADD COLUMN IF NOT EXISTS time_spent INTEGER;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS trivia_attempts_user_id_idx ON trivia_attempts(user_id);
CREATE INDEX IF NOT EXISTS trivia_attempts_game_id_idx ON trivia_attempts(game_id);
CREATE INDEX IF NOT EXISTS trivia_attempts_created_at_idx ON trivia_attempts(created_at DESC);

-- Add constraints
ALTER TABLE trivia_attempts 
ADD CONSTRAINT IF NOT EXISTS score_range CHECK (score >= 0 AND score <= total_questions);

-- Comments for documentation
COMMENT ON TABLE trivia_attempts IS 'Stores trivia game attempts and scores';
COMMENT ON COLUMN trivia_attempts.user_id IS 'Reference to the user who played the game';
COMMENT ON COLUMN trivia_attempts.game_id IS 'ID of the specific trivia game (e.g., sf-districts)';
COMMENT ON COLUMN trivia_attempts.score IS 'Number of correct answers';
COMMENT ON COLUMN trivia_attempts.total_questions IS 'Total number of questions in the game';
COMMENT ON COLUMN trivia_attempts.correct_answers IS 'Explicit count of correct answers (same as score)';
COMMENT ON COLUMN trivia_attempts.time_spent IS 'Time spent playing in seconds'; 