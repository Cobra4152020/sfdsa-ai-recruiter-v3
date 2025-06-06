-- Create volunteer_applications table for managing volunteer recruiter applications
-- This table stores applications that require admin approval before access is granted

CREATE TABLE IF NOT EXISTS volunteer_applications (
  id BIGSERIAL PRIMARY KEY,
  application_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- Address Information
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(10) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  
  -- Personal Details
  date_of_birth DATE NOT NULL,
  
  -- Professional Background
  experience TEXT,
  motivation TEXT NOT NULL,
  availability VARCHAR(50) NOT NULL,
  
  -- Resume/Documents
  resume_url TEXT,
  resume_filename VARCHAR(255),
  
  -- Consent and Agreement
  background_check_consent BOOLEAN NOT NULL DEFAULT FALSE,
  terms_agreement BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Application Status and Workflow
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, under_review
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  
  -- Auto-generated fields
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_email ON volunteer_applications(email);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_created_at ON volunteer_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_application_id ON volunteer_applications(application_id);

-- Enable Row Level Security
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Only admins can view all applications
CREATE POLICY "Admins can view all applications" ON volunteer_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Only admins can update applications (for approval/rejection)
CREATE POLICY "Admins can update applications" ON volunteer_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Anyone can insert applications (public application submission)
CREATE POLICY "Anyone can submit applications" ON volunteer_applications
  FOR INSERT WITH CHECK (true);

-- Update function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_volunteer_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_volunteer_applications_updated_at ON volunteer_applications;
CREATE TRIGGER trigger_volunteer_applications_updated_at
  BEFORE UPDATE ON volunteer_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_volunteer_applications_updated_at();

-- Create storage bucket for volunteer application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('volunteer-applications', 'volunteer-applications', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for volunteer applications bucket
-- Allow public uploads (for application submissions)
CREATE POLICY "Allow public uploads to volunteer-applications" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'volunteer-applications');

-- Allow public downloads (for admin review)
CREATE POLICY "Allow public downloads from volunteer-applications" ON storage.objects
  FOR SELECT USING (bucket_id = 'volunteer-applications');

-- Only allow admins to delete files
CREATE POLICY "Only admins can delete from volunteer-applications" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'volunteer-applications' AND
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create a view for admin dashboard to easily see application summary
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

-- Grant access to the view for admins
GRANT SELECT ON volunteer_application_summary TO authenticated;

-- Add helpful comments
COMMENT ON TABLE volunteer_applications IS 'Stores volunteer recruiter applications that require admin approval';
COMMENT ON COLUMN volunteer_applications.status IS 'Application status: pending, under_review, approved, rejected';
COMMENT ON COLUMN volunteer_applications.reviewed_by IS 'Admin user who reviewed the application';
COMMENT ON VIEW volunteer_application_summary IS 'Summary view of volunteer applications for admin dashboard'; 