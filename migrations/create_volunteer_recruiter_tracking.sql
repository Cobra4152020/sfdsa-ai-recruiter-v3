-- Create table for tracking referral links
CREATE TABLE IF NOT EXISTS referral_links (
  id SERIAL PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create table for tracking referral link clicks
CREATE TABLE IF NOT EXISTS referral_link_clicks (
  id SERIAL PRIMARY KEY,
  link_id INTEGER REFERENCES referral_links(id) ON DELETE CASCADE,
  ip_address VARCHAR(255),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for tracking referral conversions (signups)
CREATE TABLE IF NOT EXISTS referral_conversions (
  id SERIAL PRIMARY KEY,
  link_id INTEGER REFERENCES referral_links(id) ON DELETE SET NULL,
  recruit_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tracking_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'signed_up',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for contact history
CREATE TABLE IF NOT EXISTS recruit_contacts (
  id SERIAL PRIMARY KEY,
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recruit_email VARCHAR(255) NOT NULL,
  recruit_name VARCHAR(255),
  recruit_phone VARCHAR(255),
  tracking_id VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'sent',
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER set_timestamp_referral_links
BEFORE UPDATE ON referral_links
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_referral_conversions
BEFORE UPDATE ON referral_conversions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create an index on the tracking_id column for faster lookups
CREATE INDEX IF NOT EXISTS idx_referral_conversions_tracking_id ON referral_conversions(tracking_id);
CREATE INDEX IF NOT EXISTS idx_recruit_contacts_tracking_id ON recruit_contacts(tracking_id);

-- Add column to user_profiles table for referral tracking if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'referred_by'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referred_by VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'referral_tracking_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referral_tracking_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'is_volunteer_recruiter'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_volunteer_recruiter BOOLEAN DEFAULT FALSE;
  END IF;
END
$$;
