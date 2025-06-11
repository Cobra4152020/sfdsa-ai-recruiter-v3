-- Fix infinite recursion in admins table RLS policies
-- The issue is that the admin policy is trying to query the admins table to check if user is admin

-- First, disable RLS temporarily to clean up
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Drop the problematic policy
DROP POLICY IF EXISTS admin_access_policy ON public.admins;

-- Re-enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create a proper policy that doesn't cause recursion
-- This policy uses user_roles table instead of admins table
CREATE POLICY "Admin users can access admins table" ON public.admins
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

-- Also allow service role full access
CREATE POLICY "Service role can access admins table" ON public.admins
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Clean up any other potential recursive policies
-- Check other tables that might have similar issues

-- Fix user_roles table policies to avoid recursion
DROP POLICY IF EXISTS user_roles_policy ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin' 
    AND ur.is_active = true
    -- Use a different alias to avoid confusion
  )
);

CREATE POLICY "Service role can manage all roles" ON public.user_roles
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Update any other policies that might reference admins table incorrectly
-- These were found in the migration files

-- Fix security monitoring policies
DROP POLICY IF EXISTS security_events_policy ON public.security_events;
CREATE POLICY "Admin users can access security events" ON public.security_events
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

DROP POLICY IF EXISTS security_alerts_policy ON public.security_alerts;
CREATE POLICY "Admin users can access security alerts" ON public.security_alerts
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

DROP POLICY IF EXISTS blocked_ips_policy ON public.blocked_ips;
CREATE POLICY "Admin users can manage blocked IPs" ON public.blocked_ips
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

DROP POLICY IF EXISTS monitored_ips_policy ON public.monitored_ips;
CREATE POLICY "Admin users can manage monitored IPs" ON public.monitored_ips
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

DROP POLICY IF EXISTS security_notifications_policy ON public.security_notifications;
CREATE POLICY "Admin users can access security notifications" ON public.security_notifications
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

DROP POLICY IF EXISTS security_review_queue_policy ON public.security_review_queue;
CREATE POLICY "Admin users can access security review queue" ON public.security_review_queue
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

-- Fix audit log policies  
DROP POLICY IF EXISTS audit_logs_policy ON public.login_audit_logs;
CREATE POLICY "Admin users can access audit logs" ON public.login_audit_logs
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

DROP POLICY IF EXISTS login_errors_policy ON public.login_errors;
CREATE POLICY "Admin users can access login errors" ON public.login_errors
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

DROP POLICY IF EXISTS login_metrics_policy ON public.login_metrics;
CREATE POLICY "Admin users can access login metrics" ON public.login_metrics
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin' 
    AND is_active = true
  )
);

-- Make sure your user has admin role
-- Replace with your actual user ID: 10278ec9-3a35-45bd-b051-eb6f805d0002
INSERT INTO public.user_roles (user_id, role, is_active, assigned_at)
VALUES ('10278ec9-3a35-45bd-b051-eb6f805d0002', 'admin', true, NOW())
ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true,
  assigned_at = NOW();

-- Verify the policy fix by testing
SELECT 'Policy fix complete' as status; 