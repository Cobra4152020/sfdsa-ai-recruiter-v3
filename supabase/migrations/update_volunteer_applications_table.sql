-- Update volunteer_applications table to match new requirements
-- Make address fields optional, remove date_of_birth, add ip_address logging

-- Make address fields optional (allow NULL values)
ALTER TABLE volunteer_applications 
  ALTER COLUMN address DROP NOT NULL,
  ALTER COLUMN city DROP NOT NULL,
  ALTER COLUMN state DROP NOT NULL,
  ALTER COLUMN zip_code DROP NOT NULL;

-- Remove date_of_birth column (no longer collected)
ALTER TABLE volunteer_applications 
  DROP COLUMN IF EXISTS date_of_birth;

-- Add ip_address column for security logging
ALTER TABLE volunteer_applications 
  ADD COLUMN IF NOT EXISTS ip_address INET;

-- Create index for IP address (useful for security analysis)
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_ip_address ON volunteer_applications(ip_address);

-- Update the view to reflect changes
CREATE OR REPLACE VIEW volunteer_application_summary AS
SELECT 
  id,
  application_id,
  first_name,
  last_name,
  email,
  phone,
  city,
  state,
  availability,
  status,
  resume_filename,
  ip_address,
  created_at,
  reviewed_at,
  reviewed_by,
  CASE 
    WHEN status = 'pending' THEN 'Awaiting Review'
    WHEN status = 'under_review' THEN 'Under Review'
    WHEN status = 'approved' THEN 'Approved'
    WHEN status = 'rejected' THEN 'Rejected'
    ELSE 'Unknown'
  END as status_display,
  EXTRACT(DAYS FROM NOW() - created_at) as days_pending
FROM volunteer_applications
ORDER BY created_at DESC;

-- Add comments for new changes
COMMENT ON COLUMN volunteer_applications.ip_address IS 'IP address of applicant for security logging';
COMMENT ON COLUMN volunteer_applications.address IS 'Street address (optional)';
COMMENT ON COLUMN volunteer_applications.city IS 'City (optional)';
COMMENT ON COLUMN volunteer_applications.state IS 'State (optional)';
COMMENT ON COLUMN volunteer_applications.zip_code IS 'ZIP code (optional)'; 