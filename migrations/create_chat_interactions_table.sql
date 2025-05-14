-- Create chat_interactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_interactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sentiment VARCHAR(20),
  topic VARCHAR(50),
  session_id VARCHAR(100)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS chat_interactions_user_id_idx ON chat_interactions(user_id);
CREATE INDEX IF NOT EXISTS chat_interactions_created_at_idx ON chat_interactions(created_at);

-- Add function to analyze chat sentiment (basic implementation)
CREATE OR REPLACE FUNCTION analyze_chat_sentiment(message TEXT)
RETURNS VARCHAR(20) AS $$
DECLARE
  positive_words TEXT[] := ARRAY['great', 'good', 'excellent', 'amazing', 'wonderful', 'happy', 'interested', 'like', 'love', 'thanks', 'thank', 'appreciate'];
  negative_words TEXT[] := ARRAY['bad', 'poor', 'terrible', 'awful', 'horrible', 'sad', 'angry', 'hate', 'dislike', 'disappointed', 'frustrating', 'confusing'];
  positive_count INTEGER := 0;
  negative_count INTEGER := 0;
  word TEXT;
BEGIN
  -- Count positive words
  FOREACH word IN ARRAY positive_words LOOP
    positive_count := positive_count + (SELECT COUNT(*) FROM regexp_matches(LOWER(message), CONCAT('\y', word, '\y'), 'g'));
  END LOOP;
  
  -- Count negative words
  FOREACH word IN ARRAY negative_words LOOP
    negative_count := negative_count + (SELECT COUNT(*) FROM regexp_matches(LOWER(message), CONCAT('\y', word, '\y'), 'g'));
  END LOOP;
  
  -- Determine sentiment
  IF positive_count > negative_count THEN
    RETURN 'positive';
  ELSIF negative_count > positive_count THEN
    RETURN 'negative';
  ELSE
    RETURN 'neutral';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically analyze sentiment
CREATE OR REPLACE FUNCTION update_chat_sentiment()
RETURNS TRIGGER AS $$
BEGIN
  NEW.sentiment := analyze_chat_sentiment(NEW.message);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS chat_sentiment_trigger ON chat_interactions;

-- Create the trigger
CREATE TRIGGER chat_sentiment_trigger
BEFORE INSERT ON chat_interactions
FOR EACH ROW
EXECUTE FUNCTION update_chat_sentiment();
