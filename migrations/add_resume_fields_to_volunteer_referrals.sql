-- Add resume fields to volunteer_referrals table
-- This allows volunteer recruiters to attach resumes when contacting potential recruits

DO $$
BEGIN
  -- Add resume_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'volunteer_referrals' AND column_name = 'resume_url'
  ) THEN
    ALTER TABLE volunteer_referrals ADD COLUMN resume_url TEXT;
  END IF;
  
  -- Add resume_filename column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'volunteer_referrals' AND column_name = 'resume_filename'
  ) THEN
    ALTER TABLE volunteer_referrals ADD COLUMN resume_filename VARCHAR(255);
  END IF;

  -- Add tracking_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'volunteer_referrals' AND column_name = 'tracking_id'
  ) THEN
    ALTER TABLE volunteer_referrals ADD COLUMN tracking_id VARCHAR(50) UNIQUE;
  END IF;
END$$;

-- Create index on tracking_id for better query performance
CREATE INDEX IF NOT EXISTS idx_volunteer_referrals_tracking_id 
ON volunteer_referrals(tracking_id);

-- Create index on recruiter_id for better query performance
CREATE INDEX IF NOT EXISTS idx_volunteer_referrals_recruiter_id 
ON volunteer_referrals(recruiter_id);

-- Add comment to the table explaining the new fields
COMMENT ON COLUMN volunteer_referrals.resume_url IS 'URL to the uploaded resume file in storage';
COMMENT ON COLUMN volunteer_referrals.resume_filename IS 'Original filename of the uploaded resume';
COMMENT ON COLUMN volunteer_referrals.tracking_id IS 'Unique tracking ID for referral campaigns'; 