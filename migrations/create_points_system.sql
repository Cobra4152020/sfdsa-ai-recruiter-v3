-- Create points_history table
CREATE TABLE IF NOT EXISTS points_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create points_rewards table
CREATE TABLE IF NOT EXISTS points_rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES points_rewards(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create function to update points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total points in recruit.users table
    UPDATE recruit.users
    SET points = (
        SELECT COALESCE(SUM(points), 0)
        FROM points_history
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for points updates
CREATE TRIGGER points_history_update
AFTER INSERT OR UPDATE OR DELETE ON points_history
FOR EACH ROW
EXECUTE FUNCTION update_user_points();

-- Insert initial rewards
INSERT INTO points_rewards (name, description, points_required, reward_type) VALUES
('Exclusive Content Access', 'Access to exclusive deputy sheriff training content', 100, 'content'),
('Special Event Access', 'Join exclusive recruitment events', 200, 'event'),
('Mentorship Program', 'One-on-one mentorship with experienced deputies', 500, 'mentorship'),
('Priority Application', 'Get priority processing for your application', 1000, 'application')
ON CONFLICT DO NOTHING; 