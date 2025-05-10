-- Create email confirmation tokens table
CREATE TABLE IF NOT EXISTS email_confirmation_tokens (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT email_token_unique UNIQUE (email, token)
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS email_confirmation_tokens_token_idx ON email_confirmation_tokens(token);

-- Create index for checking existing tokens for an email
CREATE INDEX IF NOT EXISTS email_confirmation_tokens_email_idx ON email_confirmation_tokens(email);
