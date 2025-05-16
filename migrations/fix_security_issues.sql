-- Fix Security Definer Views
ALTER VIEW IF EXISTS public.trivia_leaderboard SET (security_invoker = true);
ALTER VIEW IF EXISTS public.active_tiktok_challenges SET (security_invoker = true);
ALTER VIEW IF EXISTS public.tiktok_challenge_leaderboard SET (security_invoker = true);
ALTER VIEW IF EXISTS public.user_points_total_view SET (security_invoker = true);

-- Enable RLS on tables
ALTER TABLE IF EXISTS public.login_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.login_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.login_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.points_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_nft_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.nft_award_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS recruit.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS volunteer.recruiters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS admin_access_policy ON public.admins;
DROP POLICY IF EXISTS audit_logs_policy ON public.login_audit_logs;
DROP POLICY IF EXISTS login_errors_policy ON public.login_errors;
DROP POLICY IF EXISTS login_metrics_policy ON public.login_metrics;
DROP POLICY IF EXISTS points_transactions_policy ON public.points_transactions;
DROP POLICY IF EXISTS user_points_policy ON public.user_points;
DROP POLICY IF EXISTS user_notifications_policy ON public.user_notifications;
DROP POLICY IF EXISTS points_history_policy ON public.points_history;
DROP POLICY IF EXISTS points_rewards_policy ON public.points_rewards;
DROP POLICY IF EXISTS user_rewards_policy ON public.user_rewards;
DROP POLICY IF EXISTS user_nft_awards_policy ON public.user_nft_awards;
DROP POLICY IF EXISTS nft_award_tiers_policy ON public.nft_award_tiers;
DROP POLICY IF EXISTS user_roles_policy ON public.user_roles;
DROP POLICY IF EXISTS notifications_policy ON public.notifications;
DROP POLICY IF EXISTS user_types_policy ON public.user_types;
DROP POLICY IF EXISTS recruit_users_policy ON recruit.users;
DROP POLICY IF EXISTS volunteer_recruiters_policy ON volunteer.recruiters;

-- Create RLS policies
CREATE POLICY admin_access_policy ON public.admins
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY audit_logs_policy ON public.login_audit_logs
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY login_errors_policy ON public.login_errors
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY login_metrics_policy ON public.login_metrics
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY points_transactions_policy ON public.points_transactions
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id::text = auth.uid()::text
    );

CREATE POLICY user_points_policy ON public.user_points
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id::text = auth.uid()::text
    );

CREATE POLICY user_notifications_policy ON public.user_notifications
    USING (user_id::text = auth.uid()::text);

CREATE POLICY points_history_policy ON public.points_history
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id::text = auth.uid()::text
    );

CREATE POLICY points_rewards_policy ON public.points_rewards
    USING (auth.role() = 'authenticated');

CREATE POLICY user_rewards_policy ON public.user_rewards
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id::text = auth.uid()::text
    );

CREATE POLICY user_nft_awards_policy ON public.user_nft_awards
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id::text = auth.uid()::text
    );

CREATE POLICY nft_award_tiers_policy ON public.nft_award_tiers
    USING (auth.role() = 'authenticated');

CREATE POLICY user_roles_policy ON public.user_roles
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id::text = auth.uid()::text
    );

CREATE POLICY notifications_policy ON public.notifications
    USING (user_id::text = auth.uid()::text);

CREATE POLICY user_types_policy ON public.user_types
    USING (auth.role() = 'authenticated');

CREATE POLICY recruit_users_policy ON recruit.users
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR id::text = auth.uid()::text
    );

CREATE POLICY volunteer_recruiters_policy ON volunteer.recruiters
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR id::text = auth.uid()::text
    );

-- Move pg_trgm extension to private schema if it exists
CREATE SCHEMA IF NOT EXISTS private;
ALTER EXTENSION IF EXISTS pg_trgm SET SCHEMA private;

-- Fix function search paths
ALTER FUNCTION IF EXISTS public.get_leaderboard_cache SET search_path = public, pg_temp;
ALTER FUNCTION IF EXISTS public.get_weekly_leaderboard_cache SET search_path = public, pg_temp;
ALTER FUNCTION IF EXISTS public.is_public_leaderboard SET search_path = public, pg_temp;

-- Handle materialized views
REVOKE SELECT ON public.leaderboard_cache FROM anon, authenticated;
REVOKE SELECT ON public.leaderboard_weekly_cache FROM anon, authenticated;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS notifications_policy ON public.notifications;

-- Create notifications policy
CREATE POLICY notifications_policy ON public.notifications
    USING (user_id::text = auth.uid()::text);

-- Create leaderboard cache tables
CREATE TABLE IF NOT EXISTS public.leaderboard_cache (
    rank INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    username TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (rank, user_id)
);

CREATE TABLE IF NOT EXISTS public.leaderboard_weekly_cache (
    rank INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    username TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (rank, user_id)
);

-- Enable RLS on leaderboard cache tables
ALTER TABLE public.leaderboard_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_weekly_cache ENABLE ROW LEVEL SECURITY;

-- Create function to check if leaderboard is public
CREATE OR REPLACE FUNCTION public.is_public_leaderboard()
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE sql
AS $is_public$
    SELECT EXISTS (
        SELECT 1 FROM public.system_settings 
        WHERE setting_key = 'public_leaderboard' 
        AND setting_value::boolean = true
    );
$is_public$ LANGUAGE sql;

-- Create leaderboard cache access function
CREATE OR REPLACE FUNCTION public.get_leaderboard_cache(
    user_id uuid DEFAULT auth.uid()
)
RETURNS TABLE (
    rank integer,
    user_id uuid,
    points integer,
    username text
)
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE sql
AS $get_leaderboard$
    SELECT rank, user_id, points, username
    FROM public.leaderboard_cache
    WHERE
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id::text = auth.uid()::text
        OR true = public.is_public_leaderboard()
$get_leaderboard$ LANGUAGE sql;

-- Create weekly leaderboard cache access function
CREATE OR REPLACE FUNCTION public.get_weekly_leaderboard_cache(
    user_id uuid DEFAULT auth.uid()
)
RETURNS TABLE (
    rank integer,
    user_id uuid,
    points integer,
    username text
)
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE sql
AS $get_weekly_leaderboard$
    SELECT rank, user_id, points, username
    FROM public.leaderboard_weekly_cache
    WHERE
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id::text = auth.uid()::text
        OR true = public.is_public_leaderboard()
$get_weekly_leaderboard$ LANGUAGE sql;

-- Add comments to functions
COMMENT ON FUNCTION public.get_leaderboard_cache IS 'Secure access to leaderboard cache with RLS';
COMMENT ON FUNCTION public.get_weekly_leaderboard_cache IS 'Secure access to weekly leaderboard cache with RLS'; 