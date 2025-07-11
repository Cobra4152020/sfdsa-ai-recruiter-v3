-- Create profile photo approval system
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

-- Add photo approval fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS pending_avatar_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_approval_status TEXT DEFAULT 'none' CHECK (avatar_approval_status IN ('none', 'pending', 'approved', 'rejected'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profile_photo_approvals_user_id ON profile_photo_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_photo_approvals_status ON profile_photo_approvals(status);
