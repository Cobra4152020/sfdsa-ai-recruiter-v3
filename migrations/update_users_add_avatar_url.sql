-- Add avatar_url column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add bio column to users table if it doesn't exist (for completeness)
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create index on participation_count for faster leaderboard queries
CREATE INDEX IF NOT EXISTS users_participation_count_idx ON users(participation_count DESC);

-- Add default avatars to existing users
UPDATE users 
SET avatar_url = '/placeholder.svg?height=64&width=64&query=user-' || id::text
WHERE avatar_url IS NULL;

-- Comment explaining the schema
COMMENT ON TABLE users IS 'Stores user information including profile data and participation metrics';
COMMENT ON COLUMN users.avatar_url IS 'URL to user avatar image, can be external or internal path';
COMMENT ON COLUMN users.bio IS 'User biography or description text';
