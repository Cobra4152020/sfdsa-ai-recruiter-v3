-- Create trivia_questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS trivia_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT,
  category TEXT,
  image_url TEXT,
  image_alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trivia_attempts table if it doesn't exist
CREATE TABLE IF NOT EXISTS trivia_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trivia_shares table if it doesn't exist
CREATE TABLE IF NOT EXISTS trivia_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  question_id TEXT,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trivia_questions_game_id ON trivia_questions(game_id);
CREATE INDEX IF NOT EXISTS idx_trivia_attempts_user_id ON trivia_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_trivia_attempts_game_id ON trivia_attempts(game_id);
CREATE INDEX IF NOT EXISTS idx_trivia_shares_user_id ON trivia_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_trivia_shares_game_id ON trivia_shares(game_id);

-- Create function to add points if it doesn't exist
CREATE OR REPLACE FUNCTION add_points(
  p_user_id UUID,
  p_points INTEGER,
  p_source TEXT,
  p_description TEXT
) RETURNS VOID AS $$
BEGIN
  -- Insert into user_points table
  INSERT INTO user_points (user_id, points, source, description)
  VALUES (p_user_id, p_points, p_source, p_description);
  
  -- Update total points in users table if it exists
  BEGIN
    UPDATE users
    SET total_points = COALESCE(total_points, 0) + p_points
    WHERE id = p_user_id;
  EXCEPTION
    WHEN undefined_column THEN
      -- Column doesn't exist, ignore
      NULL;
  END;
END;
$$ LANGUAGE plpgsql;
