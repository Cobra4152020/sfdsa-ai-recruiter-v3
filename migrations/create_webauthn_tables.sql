-- Create table for storing user authenticators
CREATE TABLE IF NOT EXISTS user_authenticators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id BYTEA NOT NULL,
  public_key BYTEA NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  transports TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_authenticators_user_id ON user_authenticators(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_authenticators_credential_id ON user_authenticators(credential_id);

-- Create table for storing WebAuthn challenges
CREATE TABLE IF NOT EXISTS webauthn_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('registration', 'authentication')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index on user_id and type for faster lookups
CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_user_id ON webauthn_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_type ON webauthn_challenges(type);
CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_expires_at ON webauthn_challenges(expires_at);

-- Add RLS policies
ALTER TABLE user_authenticators ENABLE ROW LEVEL SECURITY;
ALTER TABLE webauthn_challenges ENABLE ROW LEVEL SECURITY;

-- Create policies for user_authenticators
CREATE POLICY "Users can read their own authenticators"
  ON user_authenticators FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own authenticators"
  ON user_authenticators FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own authenticators"
  ON user_authenticators FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own authenticators"
  ON user_authenticators FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for webauthn_challenges
CREATE POLICY "Users can read their own challenges"
  ON webauthn_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges"
  ON webauthn_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges"
  ON webauthn_challenges FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to clean up expired challenges
CREATE OR REPLACE FUNCTION cleanup_expired_challenges()
RETURNS void AS $$
BEGIN
  DELETE FROM webauthn_challenges
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired challenges every hour
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    PERFORM cron.schedule('0 * * * *', 'SELECT cleanup_expired_challenges()');
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- If pg_cron is not available, we'll skip the scheduled job
  RAISE NOTICE 'pg_cron extension not available, skipping scheduled cleanup job';
END $$; 