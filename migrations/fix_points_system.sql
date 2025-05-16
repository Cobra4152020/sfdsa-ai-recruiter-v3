-- Create recruit schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS recruit;

-- Create recruit.users table if it doesn't exist
CREATE TABLE IF NOT EXISTS recruit.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Drop existing points tables if they exist
DROP TABLE IF EXISTS user_rewards CASCADE;
DROP TABLE IF EXISTS points_rewards CASCADE;
DROP TABLE IF EXISTS points_history CASCADE;

-- Recreate points tables with proper dependencies
CREATE TABLE points_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE points_rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE user_rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    reward_id UUID NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reward FOREIGN KEY (reward_id) REFERENCES points_rewards(id) ON DELETE CASCADE
);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS points_history_update ON points_history;
DROP FUNCTION IF EXISTS update_user_points();

-- Recreate points update function with better error handling
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure recruit.users record exists
    INSERT INTO recruit.users (id, points)
    VALUES (NEW.user_id, 0)
    ON CONFLICT (id) DO NOTHING;

    -- Update total points
    UPDATE recruit.users
    SET 
        points = COALESCE((
            SELECT SUM(points)
            FROM points_history
            WHERE user_id = NEW.user_id
        ), 0),
        updated_at = TIMEZONE('utc', NOW())
    WHERE id = NEW.user_id;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error and continue
    RAISE WARNING 'Error in update_user_points: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create new trigger
CREATE TRIGGER points_history_update
AFTER INSERT OR UPDATE OR DELETE ON points_history
FOR EACH ROW
EXECUTE FUNCTION update_user_points();

-- Enable RLS on new tables
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own points history"
ON points_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view available rewards"
ON points_rewards FOR SELECT
USING (is_active = true);

CREATE POLICY "Users can view their own rewards"
ON user_rewards FOR SELECT
USING (auth.uid() = user_id);

-- Allow admins full access
CREATE POLICY "Admins can manage points history"
ON points_history FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "Admins can manage rewards"
ON points_rewards FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

CREATE POLICY "Admins can manage user rewards"
ON user_rewards FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
); 