-- Create leaderboard table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    points INTEGER NOT NULL DEFAULT 0,
    rank INTEGER,
    category TEXT NOT NULL DEFAULT 'overall',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category)
);

-- Create recruiter_leaderboard table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.recruiter_leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    points INTEGER NOT NULL DEFAULT 0,
    rank INTEGER,
    referral_count INTEGER NOT NULL DEFAULT 0,
    successful_referrals INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create recruiter_rewards table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.recruiter_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to get leaderboard
CREATE OR REPLACE FUNCTION public.get_leaderboard(
    category TEXT,
    limit_val INTEGER DEFAULT 10,
    offset_val INTEGER DEFAULT 0,
    search_term TEXT DEFAULT NULL,
    timeframe TEXT DEFAULT 'all'
)
RETURNS TABLE (
    rank INTEGER,
    user_id UUID,
    username TEXT,
    points INTEGER,
    badge_count INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ranked_users AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY l.points DESC) as rank,
            l.user_id,
            u.username,
            l.points,
            COUNT(ub.badge_id) as badge_count
        FROM public.leaderboard l
        JOIN public.users u ON l.user_id = u.id
        LEFT JOIN public.user_badges ub ON u.id = ub.user_id
        WHERE 
            (category IS NULL OR l.category = category) AND
            (search_term IS NULL OR u.username ILIKE '%' || search_term || '%') AND
            (
                timeframe = 'all' OR
                (timeframe = 'week' AND l.updated_at >= NOW() - INTERVAL '1 week') OR
                (timeframe = 'month' AND l.updated_at >= NOW() - INTERVAL '1 month') OR
                (timeframe = 'year' AND l.updated_at >= NOW() - INTERVAL '1 year')
            )
        GROUP BY l.user_id, u.username, l.points
        ORDER BY l.points DESC
    )
    SELECT * FROM ranked_users
    LIMIT limit_val
    OFFSET offset_val;
END;
$$;

-- Create function to get aggregated metrics
CREATE OR REPLACE FUNCTION public.get_aggregated_metrics(
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    metric_name TEXT,
    metric_value BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM (
        SELECT 'total_users' as metric_name, 
               COUNT(*)::BIGINT as metric_value 
        FROM public.users 
        WHERE created_at BETWEEN start_date AND end_date
        UNION ALL
        SELECT 'total_badges_awarded', 
               COUNT(*)::BIGINT 
        FROM public.user_badges 
        WHERE awarded_at BETWEEN start_date AND end_date
        UNION ALL
        SELECT 'total_points_earned', 
               COALESCE(SUM(points)::BIGINT, 0) 
        FROM public.leaderboard 
        WHERE updated_at BETWEEN start_date AND end_date
        UNION ALL
        SELECT 'active_users', 
               COUNT(DISTINCT user_id)::BIGINT 
        FROM public.leaderboard 
        WHERE updated_at BETWEEN start_date AND end_date
    ) metrics;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_category ON public.leaderboard(user_id, category);
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON public.leaderboard(points DESC);
CREATE INDEX IF NOT EXISTS idx_recruiter_leaderboard_points ON public.recruiter_leaderboard(points DESC);
CREATE INDEX IF NOT EXISTS idx_recruiter_rewards_points ON public.recruiter_rewards(points_required);

-- Add trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leaderboard_timestamp
    BEFORE UPDATE ON public.leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiter_leaderboard_timestamp
    BEFORE UPDATE ON public.recruiter_leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruiter_rewards_timestamp
    BEFORE UPDATE ON public.recruiter_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 