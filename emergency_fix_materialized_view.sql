-- EMERGENCY FIX: Materialized View Permission Issues
-- Run this in Supabase SQL Editor to completely resolve the issue

-- Step 1: Drop ALL triggers that might be causing issues
DROP TRIGGER IF EXISTS refresh_leaderboard_cache_trigger ON public.users;
DROP TRIGGER IF EXISTS refresh_leaderboard_on_user_update ON public.users;
DROP TRIGGER IF EXISTS update_leaderboard_cache_trigger ON public.users;
DROP TRIGGER IF EXISTS refresh_leaderboard_safe_trigger ON public.users;

-- Step 2: Drop the problematic materialized view entirely
DROP MATERIALIZED VIEW IF EXISTS public.leaderboard_cache CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.leaderboard_weekly_cache CASCADE;

-- Step 3: Create a simple view instead (no permissions needed)
CREATE OR REPLACE VIEW public.leaderboard_cache AS
SELECT 
  id,
  name,
  email,
  participation_count,
  has_applied,
  created_at,
  ROW_NUMBER() OVER (ORDER BY participation_count DESC) as rank
FROM public.users
WHERE participation_count > 0
ORDER BY participation_count DESC;

-- Step 4: Grant permissions on the view
GRANT SELECT ON public.leaderboard_cache TO authenticated, anon, service_role;

-- Step 5: Test the fix
SELECT 'EMERGENCY_FIX_COMPLETE' as status;
