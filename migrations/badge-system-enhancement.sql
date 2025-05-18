-- Badge System Enhancement Migration

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Badge Collections
CREATE TABLE badge_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    theme VARCHAR(100),
    special_reward TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Badge Collection Memberships
CREATE TABLE badge_collection_memberships (
    collection_id UUID REFERENCES badge_collections(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    position INTEGER,
    PRIMARY KEY (collection_id, badge_id)
);

-- Badge Tiers
CREATE TABLE badge_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    tier_level INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    requirements JSONB NOT NULL,
    xp_required INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User XP
CREATE TABLE user_xp (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    last_daily_challenge TIMESTAMP WITH TIME ZONE,
    streak_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Badge Challenges
CREATE TABLE badge_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    xp_reward INTEGER NOT NULL,
    requirements JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Challenge Progress
CREATE TABLE user_challenge_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES badge_challenges(id) ON DELETE CASCADE,
    progress JSONB NOT NULL DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, challenge_id)
);

-- Badge Showcase Settings
CREATE TABLE badge_showcase_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    layout_type VARCHAR(50) NOT NULL DEFAULT 'grid',
    featured_badges UUID[] DEFAULT ARRAY[]::UUID[],
    showcase_theme VARCHAR(100) DEFAULT 'default',
    is_public BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Badge Analytics
CREATE TABLE badge_analytics (
    badge_id UUID PRIMARY KEY REFERENCES badges(id) ON DELETE CASCADE,
    total_earned INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_time_to_earn INTERVAL,
    popularity_score DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Badge Rewards
CREATE TABLE badge_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    reward_type VARCHAR(50) NOT NULL,
    reward_data JSONB NOT NULL,
    required_tier INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Badge Preferences
CREATE TABLE user_badge_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_style VARCHAR(50) DEFAULT 'standard',
    notification_settings JSONB DEFAULT '{"email": true, "push": true}',
    pinned_badges UUID[] DEFAULT ARRAY[]::UUID[],
    custom_goals JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_badge_collection_memberships_badge_id ON badge_collection_memberships(badge_id);
CREATE INDEX idx_badge_tiers_badge_id ON badge_tiers(badge_id);
CREATE INDEX idx_badge_challenges_badge_id ON badge_challenges(badge_id);
CREATE INDEX idx_user_challenge_progress_challenge_id ON user_challenge_progress(challenge_id);
CREATE INDEX idx_badge_rewards_badge_id ON badge_rewards(badge_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_badge_collections_updated_at
    BEFORE UPDATE ON badge_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_xp_updated_at
    BEFORE UPDATE ON user_xp
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badge_showcase_settings_updated_at
    BEFORE UPDATE ON badge_showcase_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badge_analytics_updated_at
    BEFORE UPDATE ON badge_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_badge_preferences_updated_at
    BEFORE UPDATE ON user_badge_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update badge analytics
CREATE OR REPLACE FUNCTION update_badge_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics when a badge is earned
    IF NEW.is_unlocked = true AND OLD.is_unlocked = false THEN
        UPDATE badge_analytics
        SET 
            total_earned = total_earned + 1,
            completion_rate = (
                SELECT CAST(COUNT(*) AS DECIMAL) / 
                       (SELECT COUNT(*) FROM badge_progress WHERE badge_id = NEW.badge_id) * 100
                FROM badge_progress 
                WHERE badge_id = NEW.badge_id AND is_unlocked = true
            ),
            average_time_to_earn = (
                SELECT AVG(unlocked_at - created_at)
                FROM badge_progress
                WHERE badge_id = NEW.badge_id AND is_unlocked = true
            )
        WHERE badge_id = NEW.badge_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_badge_analytics_on_progress
    AFTER UPDATE OF is_unlocked ON badge_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_badge_analytics(); 