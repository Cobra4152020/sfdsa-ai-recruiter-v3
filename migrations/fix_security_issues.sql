-- Fix Security Definer Views by converting them to SECURITY INVOKER
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'trivia_leaderboard' AND schemaname = 'public') THEN
        ALTER VIEW public.trivia_leaderboard SET (security_invoker = true);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'active_tiktok_challenges' AND schemaname = 'public') THEN
        ALTER VIEW public.active_tiktok_challenges SET (security_invoker = true);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'tiktok_challenge_leaderboard' AND schemaname = 'public') THEN
        ALTER VIEW public.tiktok_challenge_leaderboard SET (security_invoker = true);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'user_points_total_view' AND schemaname = 'public') THEN
        ALTER VIEW public.user_points_total_view SET (security_invoker = true);
    END IF;
END $$;

-- Enable RLS on tables that exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'login_audit_logs' AND schemaname = 'public') THEN
        ALTER TABLE public.login_audit_logs ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'login_errors' AND schemaname = 'public') THEN
        ALTER TABLE public.login_errors ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'login_metrics' AND schemaname = 'public') THEN
        ALTER TABLE public.login_metrics ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'points_transactions' AND schemaname = 'public') THEN
        ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_points' AND schemaname = 'public') THEN
        ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_notifications' AND schemaname = 'public') THEN
        ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admins' AND schemaname = 'public') THEN
        ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'points_history' AND schemaname = 'public') THEN
        ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'points_rewards' AND schemaname = 'public') THEN
        ALTER TABLE public.points_rewards ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_rewards' AND schemaname = 'public') THEN
        ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_nft_awards' AND schemaname = 'public') THEN
        ALTER TABLE public.user_nft_awards ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'nft_award_tiers' AND schemaname = 'public') THEN
        ALTER TABLE public.nft_award_tiers ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_roles' AND schemaname = 'public') THEN
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notifications' AND schemaname = 'public') THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_types' AND schemaname = 'public') THEN
        ALTER TABLE public.user_types ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users' AND schemaname = 'recruit') THEN
        ALTER TABLE recruit.users ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'recruiters' AND schemaname = 'volunteer') THEN
        ALTER TABLE volunteer.recruiters ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Add RLS Policies for tables that exist
DO $$
BEGIN
    -- Admins table policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admins' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS admin_access_policy ON public.admins;
        CREATE POLICY admin_access_policy ON public.admins
            USING (auth.uid()::text IN (SELECT id::text FROM public.admins));
    END IF;

    -- Login audit logs policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'login_audit_logs' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS audit_logs_policy ON public.login_audit_logs;
        CREATE POLICY audit_logs_policy ON public.login_audit_logs
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
            );
    END IF;

    -- Login errors policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'login_errors' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS login_errors_policy ON public.login_errors;
        CREATE POLICY login_errors_policy ON public.login_errors
            USING (auth.uid()::text IN (SELECT id::text FROM public.admins));
    END IF;

    -- Login metrics policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'login_metrics' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS login_metrics_policy ON public.login_metrics;
        CREATE POLICY login_metrics_policy ON public.login_metrics
            USING (auth.uid()::text IN (SELECT id::text FROM public.admins));
    END IF;

    -- Points transactions policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'points_transactions' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS points_transactions_policy ON public.points_transactions;
        CREATE POLICY points_transactions_policy ON public.points_transactions
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
            );
    END IF;

    -- User points policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_points' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS user_points_policy ON public.user_points;
        CREATE POLICY user_points_policy ON public.user_points
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
            );
    END IF;

    -- User notifications policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_notifications' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS user_notifications_policy ON public.user_notifications;
        CREATE POLICY user_notifications_policy ON public.user_notifications
            USING (user_id::text = auth.uid()::text);
    END IF;

    -- Points history policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'points_history' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS points_history_policy ON public.points_history;
        CREATE POLICY points_history_policy ON public.points_history
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
            );
    END IF;

    -- Points rewards policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'points_rewards' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS points_rewards_policy ON public.points_rewards;
        CREATE POLICY points_rewards_policy ON public.points_rewards
            USING (auth.role() = 'authenticated');
    END IF;

    -- User rewards policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_rewards' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS user_rewards_policy ON public.user_rewards;
        CREATE POLICY user_rewards_policy ON public.user_rewards
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
            );
    END IF;

    -- NFT awards policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_nft_awards' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS user_nft_awards_policy ON public.user_nft_awards;
        CREATE POLICY user_nft_awards_policy ON public.user_nft_awards
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
            );
    END IF;

    -- NFT award tiers policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'nft_award_tiers' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS nft_award_tiers_policy ON public.nft_award_tiers;
        CREATE POLICY nft_award_tiers_policy ON public.nft_award_tiers
            USING (auth.role() = 'authenticated');
    END IF;

    -- User roles policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_roles' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS user_roles_policy ON public.user_roles;
        CREATE POLICY user_roles_policy ON public.user_roles
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
            );
    END IF;

    -- Notifications policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notifications' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS notifications_policy ON public.notifications;
        CREATE POLICY notifications_policy ON public.notifications
            USING (user_id::text = auth.uid()::text);
    END IF;

    -- User types policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_types' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS user_types_policy ON public.user_types;
        CREATE POLICY user_types_policy ON public.user_types
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
            );
    END IF;

    -- Recruit users policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'users' AND schemaname = 'recruit') THEN
        DROP POLICY IF EXISTS recruit_users_policy ON recruit.users;
        CREATE POLICY recruit_users_policy ON recruit.users
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR auth.uid()::text IN (SELECT id::text FROM volunteer.recruiters)
                OR id::text = auth.uid()::text
            );
    END IF;

    -- Volunteer recruiters policy
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'recruiters' AND schemaname = 'volunteer') THEN
        DROP POLICY IF EXISTS volunteer_recruiters_policy ON volunteer.recruiters;
        CREATE POLICY volunteer_recruiters_policy ON volunteer.recruiters
            USING (
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR id::text = auth.uid()::text
            );
    END IF;
END $$;

-- Move pg_trgm extension to private schema if it exists and we have permissions
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'pg_trgm'
    ) THEN
        BEGIN
            CREATE SCHEMA IF NOT EXISTS private;
            ALTER EXTENSION pg_trgm SET SCHEMA private;
        EXCEPTION WHEN insufficient_privilege THEN
            -- Log the error but continue with other security fixes
            RAISE NOTICE 'Insufficient privileges to move pg_trgm extension. Skipping...';
        END;
    END IF;
END $$;

-- Fix function search paths with error handling
DO $$ 
DECLARE 
    func record;
BEGIN
    FOR func IN 
        SELECT proname, pronamespace::regnamespace as schema
        FROM pg_proc
        WHERE pronamespace = 'public'::regnamespace
        AND has_function_privilege(current_user, format('%I.%I()', 'public', proname), 'EXECUTE')
    LOOP
        BEGIN
            EXECUTE format(
                'ALTER FUNCTION %I.%I SET search_path = public, pg_temp',
                func.schema,
                func.proname
            );
        EXCEPTION WHEN insufficient_privilege THEN
            -- Log the error but continue with other functions
            RAISE NOTICE 'Insufficient privileges to modify function %.%. Skipping...', func.schema, func.proname;
        END;
    END LOOP;
END $$;

-- Handle materialized views if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_matviews
        WHERE matviewname = 'leaderboard_cache'
        AND schemaname = 'public'
    ) THEN
        REVOKE SELECT ON public.leaderboard_cache FROM anon, authenticated;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pg_matviews
        WHERE matviewname = 'leaderboard_weekly_cache'
        AND schemaname = 'public'
    ) THEN
        REVOKE SELECT ON public.leaderboard_weekly_cache FROM anon, authenticated;
    END IF;
END $$;

-- Create secure access functions for materialized views with error handling
DO $$
BEGIN
    -- Create helper function to check if leaderboard is public
    BEGIN
        CREATE OR REPLACE FUNCTION public.is_public_leaderboard()
        RETURNS boolean
        SECURITY INVOKER
        SET search_path = public, pg_temp
        LANGUAGE sql
        AS $$
            SELECT COALESCE(
                (SELECT value::boolean 
                 FROM public.system_settings 
                 WHERE key = 'public_leaderboard'),
                false
            );
        $$;
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'Insufficient privileges to create is_public_leaderboard function. Skipping...';
    END;

    -- Create leaderboard cache access function
    BEGIN
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
        AS $$
            SELECT rank, user_id, points, username 
            FROM public.leaderboard_cache
            WHERE 
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
                OR true = public.is_public_leaderboard();
        $$;
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'Insufficient privileges to create get_leaderboard_cache function. Skipping...';
    END;

    -- Create weekly leaderboard cache access function
    BEGIN
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
        AS $$
            SELECT rank, user_id, points, username 
            FROM public.leaderboard_weekly_cache
            WHERE 
                auth.uid()::text IN (SELECT id::text FROM public.admins)
                OR user_id::text = auth.uid()::text
                OR true = public.is_public_leaderboard();
        $$;
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'Insufficient privileges to create get_weekly_leaderboard_cache function. Skipping...';
    END;

    -- Add comments to functions if they were created successfully
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_leaderboard_cache') THEN
        COMMENT ON FUNCTION public.get_leaderboard_cache IS 'Secure access to leaderboard cache with RLS';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_weekly_leaderboard_cache') THEN
        COMMENT ON FUNCTION public.get_weekly_leaderboard_cache IS 'Secure access to weekly leaderboard cache with RLS';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_public_leaderboard') THEN
        COMMENT ON FUNCTION public.is_public_leaderboard IS 'Check if leaderboard is publicly viewable';
    END IF;
END $$; 