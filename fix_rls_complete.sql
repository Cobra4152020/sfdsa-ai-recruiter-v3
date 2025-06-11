-- Complete RLS Policy Fix - Handles existing policies
-- Run this in Supabase SQL Editor

-- Step 1: Fix admins table policies
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on admins table
DROP POLICY IF EXISTS "admin_access_policy" ON public.admins;
DROP POLICY IF EXISTS "Admin users can access admins table" ON public.admins;
DROP POLICY IF EXISTS "Service role can access admins table" ON public.admins;

-- Re-enable RLS and create proper policies
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_user_roles_policy" ON public.admins
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

CREATE POLICY "admins_service_role_policy" ON public.admins
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Step 2: Fix user_roles table policies (this is likely the main issue)
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_roles table
DROP POLICY IF EXISTS "user_roles_policy" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage all roles" ON public.user_roles;

-- Re-enable RLS and create NON-RECURSIVE policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own roles
CREATE POLICY "user_roles_self_select" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to do everything
CREATE POLICY "user_roles_service_all" ON public.user_roles
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow specific admin user (your ID) to manage all roles
CREATE POLICY "user_roles_specific_admin" ON public.user_roles
FOR ALL USING (auth.uid()::text = '10278ec9-3a35-45bd-b051-eb6f805d0002');

-- Step 3: Ensure you have admin role
INSERT INTO public.user_roles (user_id, role, is_active, assigned_at)
VALUES ('10278ec9-3a35-45bd-b051-eb6f805d0002', 'admin', true, NOW())
ON CONFLICT (user_id, role) DO UPDATE SET 
  is_active = true, 
  assigned_at = NOW();

-- Step 4: Check if users table has participation_count column
DO $$
BEGIN
  -- Add participation_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'participation_count'
  ) THEN
    ALTER TABLE public.users ADD COLUMN participation_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Step 5: Ensure RLS allows updates to users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might be blocking
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage all users" ON public.users;

-- Create permissive policies for users table
CREATE POLICY "users_self_access" ON public.users
FOR ALL USING (auth.uid() = id);

CREATE POLICY "users_service_access" ON public.users
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow your specific admin user to access all user records
CREATE POLICY "users_admin_access" ON public.users
FOR ALL USING (auth.uid()::text = '10278ec9-3a35-45bd-b051-eb6f805d0002');

-- Step 6: Verify the fix
SELECT 
  'RLS_POLICIES_UPDATED' as status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'admins') as admins_policies,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_roles') as user_roles_policies,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') as users_policies;

-- Step 7: Test user role check
SELECT 
  'USER_ROLE_CHECK' as test,
  user_id,
  role,
  is_active
FROM public.user_roles 
WHERE user_id = '10278ec9-3a35-45bd-b051-eb6f805d0002';

SELECT 'SETUP_COMPLETE' as final_status; 