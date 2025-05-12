-- Create trivia_games table
CREATE TABLE IF NOT EXISTS trivia_games (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trivia_questions table
CREATE TABLE IF NOT EXISTS trivia_questions (
  id VARCHAR(255) PRIMARY KEY,
  game_id VARCHAR(255) REFERENCES trivia_games(id),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  image_alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trivia_attempts table
CREATE TABLE IF NOT EXISTS trivia_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id VARCHAR(255) REFERENCES trivia_games(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER,
  time_spent INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert the six trivia games
INSERT INTO trivia_games (id, name, description, image_url)
VALUES
  ('sf-football', 'SF Football Trivia', 'Test your knowledge about San Francisco football history and the 49ers.', '/placeholder.svg?height=300&width=500&query=San Francisco 49ers football'),
  ('sf-baseball', 'SF Baseball Trivia', 'How much do you know about the San Francisco Giants and baseball in the Bay Area?', '/placeholder.svg?height=300&width=500&query=San Francisco Giants baseball'),
  ('sf-basketball', 'SF Basketball Trivia', 'Challenge yourself with questions about the Golden State Warriors and basketball in San Francisco.', '/placeholder.svg?height=300&width=500&query=Golden State Warriors basketball'),
  ('sf-districts', 'SF District Trivia', 'Test your knowledge of San Francisco''s unique and diverse neighborhoods and districts.', '/placeholder.svg?height=300&width=500&query=San Francisco neighborhoods districts'),
  ('sf-tourist-spots', 'SF Most Popular Tourist Spots', 'How well do you know San Francisco''s famous landmarks and tourist attractions?', '/placeholder.svg?height=300&width=500&query=San Francisco tourist attractions'),
  ('sf-day-trips', 'SF Best Places to Visit', 'Test your knowledge about the best day trips and places to visit around San Francisco.', '/placeholder.svg?height=300&width=500&query=San Francisco day trips')
ON CONFLICT (id) DO NOTHING;
