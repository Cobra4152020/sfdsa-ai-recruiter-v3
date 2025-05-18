-- XP thresholds for each level
CREATE TABLE level_thresholds (
    level INTEGER PRIMARY KEY,
    xp_required INTEGER NOT NULL,
    rewards JSONB
);

-- Insert initial level thresholds
INSERT INTO level_thresholds (level, xp_required, rewards) VALUES
    (1, 0, '{"badge": "novice", "title": "Novice"}'),
    (2, 100, '{"badge": "beginner", "title": "Beginner"}'),
    (3, 300, '{"badge": "intermediate", "title": "Intermediate"}'),
    (4, 600, '{"badge": "advanced", "title": "Advanced"}'),
    (5, 1000, '{"badge": "expert", "title": "Expert"}'),
    (6, 1500, '{"badge": "master", "title": "Master"}'),
    (7, 2100, '{"badge": "grandmaster", "title": "Grandmaster"}'),
    (8, 2800, '{"badge": "legend", "title": "Legend"}'),
    (9, 3600, '{"badge": "mythical", "title": "Mythical"}'),
    (10, 4500, '{"badge": "transcendent", "title": "Transcendent"}');

-- Function to update user XP and handle level progression
CREATE OR REPLACE FUNCTION update_user_xp(
    p_user_id UUID,
    p_xp_amount INTEGER
)
RETURNS TABLE (
    new_total_xp INTEGER,
    new_level INTEGER,
    leveled_up BOOLEAN,
    rewards JSONB
) AS $$
DECLARE
    v_current_xp INTEGER;
    v_current_level INTEGER;
    v_new_total_xp INTEGER;
    v_new_level INTEGER;
    v_leveled_up BOOLEAN := false;
    v_rewards JSONB := '[]';
BEGIN
    -- Get current XP and level
    SELECT total_xp, current_level
    INTO v_current_xp, v_current_level
    FROM user_xp
    WHERE user_id = p_user_id;

    -- Initialize if not found
    IF v_current_xp IS NULL THEN
        INSERT INTO user_xp (user_id, total_xp, current_level)
        VALUES (p_user_id, 0, 1)
        RETURNING total_xp, current_level INTO v_current_xp, v_current_level;
    END IF;

    -- Calculate new total XP
    v_new_total_xp := v_current_xp + p_xp_amount;

    -- Find new level based on XP thresholds
    SELECT level
    INTO v_new_level
    FROM level_thresholds
    WHERE xp_required <= v_new_total_xp
    ORDER BY level DESC
    LIMIT 1;

    -- Check if leveled up
    IF v_new_level > v_current_level THEN
        v_leveled_up := true;
        
        -- Collect rewards for all levels gained
        SELECT json_agg(rewards)
        INTO v_rewards
        FROM level_thresholds
        WHERE level > v_current_level
        AND level <= v_new_level;

        -- Create level up event
        INSERT INTO badge_events (
            badge_id,
            user_id,
            event,
            type,
            date
        )
        VALUES (
            'level-up',
            p_user_id,
            format('Reached level %s', v_new_level),
            'milestone',
            CURRENT_TIMESTAMP
        );
    END IF;

    -- Update user_xp
    UPDATE user_xp
    SET total_xp = v_new_total_xp,
        current_level = v_new_level,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;

    -- Return results
    RETURN QUERY
    SELECT 
        v_new_total_xp AS new_total_xp,
        v_new_level AS new_level,
        v_leveled_up AS leveled_up,
        v_rewards AS rewards;
END;
$$ LANGUAGE plpgsql;

-- Function to update daily streak
CREATE OR REPLACE FUNCTION update_daily_streak(
    p_user_id UUID
)
RETURNS TABLE (
    new_streak INTEGER,
    streak_maintained BOOLEAN,
    streak_broken BOOLEAN,
    bonus_xp INTEGER
) AS $$
DECLARE
    v_last_daily TIMESTAMP WITH TIME ZONE;
    v_current_streak INTEGER;
    v_streak_maintained BOOLEAN := false;
    v_streak_broken BOOLEAN := false;
    v_bonus_xp INTEGER := 0;
BEGIN
    -- Get current streak info
    SELECT last_daily_challenge, streak_count
    INTO v_last_daily, v_current_streak
    FROM user_xp
    WHERE user_id = p_user_id;

    -- Initialize if not found
    IF v_last_daily IS NULL THEN
        UPDATE user_xp
        SET last_daily_challenge = CURRENT_TIMESTAMP,
            streak_count = 1
        WHERE user_id = p_user_id;
        
        v_current_streak := 1;
        v_streak_maintained := true;
        v_bonus_xp := 10;
    ELSE
        -- Check if within streak window (last 24-48 hours)
        IF CURRENT_TIMESTAMP - v_last_daily < INTERVAL '48 hours' AND
           CURRENT_TIMESTAMP - v_last_daily > INTERVAL '24 hours' THEN
            -- Maintain streak
            v_current_streak := v_current_streak + 1;
            v_streak_maintained := true;
            
            -- Calculate bonus XP (increases with streak)
            v_bonus_xp := 10 + (v_current_streak * 5);
            
            UPDATE user_xp
            SET last_daily_challenge = CURRENT_TIMESTAMP,
                streak_count = v_current_streak
            WHERE user_id = p_user_id;
        ELSIF CURRENT_TIMESTAMP - v_last_daily >= INTERVAL '48 hours' THEN
            -- Break streak
            v_streak_broken := true;
            v_current_streak := 1;
            
            UPDATE user_xp
            SET last_daily_challenge = CURRENT_TIMESTAMP,
                streak_count = 1
            WHERE user_id = p_user_id;
        END IF;
    END IF;

    -- Return results
    RETURN QUERY
    SELECT 
        v_current_streak AS new_streak,
        v_streak_maintained AS streak_maintained,
        v_streak_broken AS streak_broken,
        v_bonus_xp AS bonus_xp;
END;
$$ LANGUAGE plpgsql; 