-- Fix materialized view permissions and user creation issues
-- Run this in Supabase SQL Editor

-- Step 1: Fix materialized view ownership and permissions
ALTER MATERIALIZED VIEW IF EXISTS public.leaderboard_cache OWNER TO postgres;
ALTER MATERIALIZED VIEW IF EXISTS public.leaderboard_weekly_cache OWNER TO postgres;

-- Grant necessary permissions to service_role
GRANT ALL ON public.leaderboard_cache TO service_role;
GRANT ALL ON public.leaderboard_weekly_cache TO service_role;

-- Step 2: Drop any problematic triggers on users table that might be causing issues
DROP TRIGGER IF EXISTS refresh_leaderboard_on_user_update ON public.users;
DROP TRIGGER IF EXISTS update_leaderboard_cache_trigger ON public.users;

-- Step 3: Create your user record directly (bypassing any triggers)
INSERT INTO public.users (
  id, 
  email, 
  name, 
  participation_count, 
  has_applied, 
  created_at, 
  updated_at
) VALUES (
  '10278ec9-3a35-45bd-b051-eb6f805d0002',
  'cobra4152021@gmail.com',
  'SFDSA User',
  500,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  participation_count = EXCLUDED.participation_count,
  has_applied = EXCLUDED.has_applied,
  updated_at = NOW();

-- Step 4: Manually refresh the materialized views after user creation
REFRESH MATERIALIZED VIEW public.leaderboard_cache;
REFRESH MATERIALIZED VIEW public.leaderboard_weekly_cache;

-- Step 5: Create a safer trigger that won't fail on permissions
CREATE OR REPLACE FUNCTION refresh_leaderboard_safe()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to refresh materialized view, but don't fail if it errors
  BEGIN
    REFRESH MATERIALIZED VIEW public.leaderboard_cache;
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the transaction
    RAISE WARNING 'Could not refresh leaderboard_cache: %', SQLERRM;
  END;
  
  BEGIN
    REFRESH MATERIALIZED VIEW public.leaderboard_weekly_cache;
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the transaction
    RAISE WARNING 'Could not refresh leaderboard_weekly_cache: %', SQLERRM;
  END;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create the trigger with the safer function
CREATE TRIGGER refresh_leaderboard_safe_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION refresh_leaderboard_safe();

-- Step 7: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION refresh_leaderboard_safe() TO service_role;

-- Step 8: Verify your user was created successfully
SELECT 
  'USER_CREATED' as status,
  id, 
  email, 
  name, 
  participation_count, 
  has_applied,
  created_at
FROM public.users 
WHERE id = '10278ec9-3a35-45bd-b051-eb6f805d0002';

-- Step 9: Check materialized view data
SELECT 
  'LEADERBOARD_CHECK' as status,
  COUNT(*) as total_users,
  MAX(participation_count) as highest_points
FROM public.leaderboard_cache;

SELECT 'SETUP_COMPLETE' as final_status; 