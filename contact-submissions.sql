-- Create contact_submissions table for storing contact form submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  contact_reason VARCHAR(50) DEFAULT 'general',
  urgency_level VARCHAR(20) DEFAULT 'normal',
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_user_id ON contact_submissions(user_id);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_urgency ON contact_submissions(urgency_level);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
CREATE TRIGGER trigger_contact_submissions_updated_at
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the recruitment website';
COMMENT ON COLUMN contact_submissions.id IS 'Unique identifier for the contact submission';
COMMENT ON COLUMN contact_submissions.contact_reason IS 'Reason for contact: general, application, requirements, training, benefits, technical, recruitment, other';
COMMENT ON COLUMN contact_submissions.urgency_level IS 'Urgency level: low, normal, high, urgent';
COMMENT ON COLUMN contact_submissions.status IS 'Status of the inquiry: pending, in_progress, resolved, closed';
COMMENT ON COLUMN contact_submissions.user_id IS 'Reference to the user who submitted the form (if logged in)';

-- Insert some example data for testing (optional)
INSERT INTO contact_submissions (
  first_name, 
  last_name, 
  email, 
  phone, 
  subject, 
  message, 
  contact_reason, 
  urgency_level,
  status
) VALUES 
(
  'John', 
  'Doe', 
  'john.doe@example.com', 
  '(415) 555-0123', 
  'Question about application requirements', 
  'Hi, I am interested in applying for the deputy sheriff position. Could you please provide more information about the minimum requirements and the application process? Thank you.',
  'application',
  'normal',
  'pending'
),
(
  'Jane', 
  'Smith', 
  'jane.smith@example.com', 
  NULL, 
  'Training academy schedule', 
  'When does the next training academy session begin? I would like to plan accordingly.',
  'training',
  'normal',
  'pending'
),
(
  'Michael', 
  'Johnson', 
  'michael.j@example.com', 
  '(415) 555-0456', 
  'Urgent: Application deadline question', 
  'I need to know the exact deadline for the current application cycle as I am completing my paperwork.',
  'application',
  'urgent',
  'pending'
); 