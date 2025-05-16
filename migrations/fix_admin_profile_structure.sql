-- Create admin schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS admin;

-- Create admin.users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA admin TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA admin TO service_role;

-- Enable RLS on admin.users
ALTER TABLE admin.users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users
CREATE POLICY "Admin users can manage admin.users"
ON admin.users
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create policy for service role
CREATE POLICY "Service role can manage admin.users"
ON admin.users
FOR ALL
USING (auth.jwt() ? 'service_role');
