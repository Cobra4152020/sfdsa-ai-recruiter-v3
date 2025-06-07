-- Create deputy_applications table for managing deputy sheriff application interest forms
-- This table stores applications from recruits interested in deputy sheriff positions

CREATE TABLE IF NOT EXISTS deputy_applications (
  id BIGSERIAL PRIMARY KEY,
  application_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- Address Information (Optional)
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(10),
  zip_code VARCHAR(20),
  
  -- Personal Details
  date_of_birth DATE NOT NULL,
  
  -- Motivation
  motivation TEXT NOT NULL,
  
  -- Position Selection
  position VARCHAR(10) NOT NULL, -- '8302' or '8504'
  
  -- Qualifications (Checkboxes)
  has_associate_degree BOOLEAN NOT NULL DEFAULT FALSE,
  has_bachelors_degree BOOLEAN NOT NULL DEFAULT FALSE,
  has_law_enforcement_experience BOOLEAN NOT NULL DEFAULT FALSE,
  has_military_experience BOOLEAN NOT NULL DEFAULT FALSE,
  has_corrections_experience BOOLEAN NOT NULL DEFAULT FALSE,
  has_emt_certification BOOLEAN NOT NULL DEFAULT FALSE,
  has_post_certification BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Experience Details
  experience_details TEXT,
  
  -- Availability Slots (JSON array of {date, timeRange} objects)
  availability_slots JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Resume/Documents
  resume_url TEXT,
  resume_filename VARCHAR(255),
  
  -- Consent and Agreement
  background_check_consent BOOLEAN NOT NULL DEFAULT FALSE,
  terms_agreement BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Application Status and Workflow
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, contacted, qualified, rejected, in_process
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  contacted_at TIMESTAMP,
  contacted_by UUID REFERENCES auth.users(id),
  contact_notes TEXT,
  
  -- Metadata
  ip_address VARCHAR(45),
  user_agent TEXT,
  referral_source VARCHAR(100),
  
  -- Auto-generated fields
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deputy_applications_status ON deputy_applications(status);
CREATE INDEX IF NOT EXISTS idx_deputy_applications_email ON deputy_applications(email);
CREATE INDEX IF NOT EXISTS idx_deputy_applications_created_at ON deputy_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_deputy_applications_application_id ON deputy_applications(application_id);
CREATE INDEX IF NOT EXISTS idx_deputy_applications_contacted_at ON deputy_applications(contacted_at);

-- Create partial indexes for qualifications (for efficient filtering)
CREATE INDEX IF NOT EXISTS idx_deputy_applications_law_enforcement ON deputy_applications(has_law_enforcement_experience) WHERE has_law_enforcement_experience = true;
CREATE INDEX IF NOT EXISTS idx_deputy_applications_military ON deputy_applications(has_military_experience) WHERE has_military_experience = true;
CREATE INDEX IF NOT EXISTS idx_deputy_applications_degree ON deputy_applications(has_bachelors_degree) WHERE has_bachelors_degree = true;

-- Enable Row Level Security
ALTER TABLE deputy_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deputy applications
-- Admin users can view and modify all applications
CREATE POLICY "Admin users can view all deputy applications" ON deputy_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.user_metadata->>'user_type' = 'admin' OR
        auth.users.app_metadata->>'user_type' = 'admin'
      )
    )
  );

CREATE POLICY "Admin users can update all deputy applications" ON deputy_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.user_metadata->>'user_type' = 'admin' OR
        auth.users.app_metadata->>'user_type' = 'admin'
      )
    )
  );

-- Recruitment team can view and update applications
CREATE POLICY "Recruitment team can view deputy applications" ON deputy_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.user_metadata->>'user_type' = 'recruiter' OR
        auth.users.app_metadata->>'user_type' = 'recruiter' OR
        auth.users.user_metadata->>'role' = 'recruiter'
      )
    )
  );

CREATE POLICY "Recruitment team can update deputy applications" ON deputy_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.user_metadata->>'user_type' = 'recruiter' OR
        auth.users.app_metadata->>'user_type' = 'recruiter' OR
        auth.users.user_metadata->>'role' = 'recruiter'
      )
    )
  );

-- Service role can insert new applications (from API)
CREATE POLICY "Service role can insert deputy applications" ON deputy_applications
  FOR INSERT WITH CHECK (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_deputy_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at field
CREATE TRIGGER update_deputy_applications_updated_at_trigger
  BEFORE UPDATE ON deputy_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_deputy_applications_updated_at();

-- Create a view for application statistics
CREATE OR REPLACE VIEW deputy_application_stats AS
SELECT 
  COUNT(*) as total_applications,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'contacted') as contacted_count,
  COUNT(*) FILTER (WHERE status = 'qualified') as qualified_count,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
  COUNT(*) FILTER (WHERE status = 'in_process') as in_process_count,
  COUNT(*) FILTER (WHERE has_law_enforcement_experience = true) as with_law_enforcement,
  COUNT(*) FILTER (WHERE has_military_experience = true) as with_military,
  COUNT(*) FILTER (WHERE has_bachelors_degree = true) as with_degree,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as last_30_days,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as last_7_days
FROM deputy_applications;

-- Grant permissions to view stats for authorized users
GRANT SELECT ON deputy_application_stats TO authenticated; 