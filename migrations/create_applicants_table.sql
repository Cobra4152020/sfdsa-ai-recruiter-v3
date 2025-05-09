-- Create applicants table to store recruit information
CREATE TABLE IF NOT EXISTS applicants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT NOT NULL,
  tracking_number TEXT NOT NULL UNIQUE,
  referral_code TEXT,
  is_direct_application BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on tracking_number for faster lookups
CREATE INDEX IF NOT EXISTS applicants_tracking_number_idx ON applicants(tracking_number);

-- Create index on email for faster lookups and potential deduplication
CREATE INDEX IF NOT EXISTS applicants_email_idx ON applicants(email);

-- Create index on referral_code for tracking referrals
CREATE INDEX IF NOT EXISTS applicants_referral_code_idx ON applicants(referral_code);
