-- Create profile photo approval system
-- This handles user profile photo uploads that require admin approval before being displayed

-- Create table for pending photo approvals
CREATE TABLE IF NOT EXISTS public.profile_photo_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    original_filename TEXT,
    file_size INTEGER,
    mime_type TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_photo_approvals_user_id ON profile_photo_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_photo_approvals_status ON profile_photo_approvals(status);
CREATE INDEX IF NOT EXISTS idx_profile_photo_approvals_submitted_at ON profile_photo_approvals(submitted_at);

-- Add photo approval fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS pending_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_approval_status TEXT DEFAULT 'none' CHECK (avatar_approval_status IN ('none', 'pending', 'approved', 'rejected'));

-- Enable Row Level Security
ALTER TABLE profile_photo_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile_photo_approvals
-- Users can view their own photo submissions
CREATE POLICY "Users can view their own photo approvals" ON profile_photo_approvals
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own photo submissions
CREATE POLICY "Users can submit their own photos" ON profile_photo_approvals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all photo approvals
CREATE POLICY "Admins can view all photo approvals" ON profile_photo_approvals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Admins can update photo approvals (for approval/rejection)
CREATE POLICY "Admins can update photo approvals" ON profile_photo_approvals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Create function to update user profile when photo is approved
CREATE OR REPLACE FUNCTION handle_photo_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- If photo is approved, update user's avatar_url
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Update user_profiles table
    UPDATE public.user_profiles 
    SET 
      avatar_url = NEW.photo_url,
      avatar_approval_status = 'approved',
      pending_avatar_url = NULL,
      updated_at = NOW()
    WHERE id = NEW.user_id;
    
    -- Also update users table if it exists and has avatar_url
    UPDATE public.users 
    SET avatar_url = NEW.photo_url
    WHERE id = NEW.user_id;
    
  -- If photo is rejected, clear pending status
  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE public.user_profiles 
    SET 
      avatar_approval_status = 'rejected',
      pending_avatar_url = NULL,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for photo approval updates
DROP TRIGGER IF EXISTS trigger_photo_approval ON profile_photo_approvals;
CREATE TRIGGER trigger_photo_approval
  AFTER UPDATE ON profile_photo_approvals
  FOR EACH ROW
  EXECUTE FUNCTION handle_photo_approval();

-- Update function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_profile_photo_approvals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_profile_photo_approvals_updated_at ON profile_photo_approvals;
CREATE TRIGGER trigger_profile_photo_approvals_updated_at
  BEFORE UPDATE ON profile_photo_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_photo_approvals_updated_at();

-- Create storage bucket for profile photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile photos bucket
-- Allow authenticated users to upload their photos
CREATE POLICY "Allow authenticated uploads to profile-photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.role() = 'authenticated'
  );

-- Allow public viewing (so photos can be displayed once approved)
CREATE POLICY "Allow public viewing of profile-photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

-- Only allow users to delete their own files or admins to delete any
CREATE POLICY "Users can delete own files, admins can delete any" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-photos' AND
    (
      auth.uid()::text = (storage.foldername(name))[1] OR
      EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    )
  );

-- Create view for admin dashboard
CREATE OR REPLACE VIEW pending_photo_approvals AS
SELECT 
  ppa.id,
  ppa.user_id,
  ppa.photo_url,
  ppa.original_filename,
  ppa.file_size,
  ppa.mime_type,
  ppa.status,
  ppa.submitted_at,
  ppa.rejection_reason,
  COALESCE(up.full_name, up.first_name || ' ' || up.last_name, u.name) as user_name,
  COALESCE(up.email, u.email) as user_email,
  EXTRACT(DAYS FROM NOW() - ppa.submitted_at) as days_pending
FROM profile_photo_approvals ppa
LEFT JOIN user_profiles up ON ppa.user_id = up.id
LEFT JOIN users u ON ppa.user_id = u.id
WHERE ppa.status = 'pending'
ORDER BY ppa.submitted_at ASC;

-- Grant access to the view for admins
GRANT SELECT ON pending_photo_approvals TO authenticated;

-- Add helpful comments
COMMENT ON TABLE profile_photo_approvals IS 'Stores user profile photo uploads that require admin approval';
COMMENT ON COLUMN profile_photo_approvals.status IS 'Photo approval status: pending, approved, rejected';
COMMENT ON VIEW pending_photo_approvals IS 'View of pending photo approvals for admin dashboard'; 