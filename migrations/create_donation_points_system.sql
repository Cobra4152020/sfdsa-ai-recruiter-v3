-- Create donation point rules table
CREATE TABLE IF NOT EXISTS donation_point_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  min_amount DECIMAL(10, 2) NOT NULL,
  max_amount DECIMAL(10, 2),
  points_per_dollar INTEGER NOT NULL,
  recurring_multiplier DECIMAL(5, 2) DEFAULT 1.5,
  is_active BOOLEAN DEFAULT TRUE,
  campaign_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donation points table to track awarded points
CREATE TABLE IF NOT EXISTS donation_points (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  donation_id VARCHAR(255) NOT NULL,
  points INTEGER NOT NULL,
  rule_id INTEGER REFERENCES donation_point_rules(id),
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donation campaigns table
CREATE TABLE IF NOT EXISTS donation_campaigns (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  point_multiplier DECIMAL(5, 2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add donation_points column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'donation_points'
  ) THEN
    ALTER TABLE users ADD COLUMN donation_points INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create view for donation leaderboard
CREATE OR REPLACE VIEW donation_leaderboard AS
SELECT 
  u.id AS user_id,
  u.name,
  u.email,
  u.avatar_url,
  COALESCE(SUM(dp.points), 0) AS donation_points,
  COUNT(DISTINCT dp.donation_id) AS donation_count,
  MAX(dp.created_at) AS last_donation_date,
  RANK() OVER (ORDER BY COALESCE(SUM(dp.points), 0) DESC) AS rank
FROM 
  users u
LEFT JOIN 
  donation_points dp ON u.id = dp.user_id
GROUP BY 
  u.id, u.name, u.email, u.avatar_url;

-- Insert default donation point rules
INSERT INTO donation_point_rules 
  (name, description, min_amount, max_amount, points_per_dollar, recurring_multiplier)
VALUES
  ('Basic Donation', 'Standard points for donations under $50', 1.00, 49.99, 10, 1.5),
  ('Supporter Donation', 'Enhanced points for donations between $50-$99', 50.00, 99.99, 15, 1.5),
  ('Champion Donation', 'Premium points for donations between $100-$499', 100.00, 499.99, 20, 1.5),
  ('Benefactor Donation', 'Elite points for donations of $500 or more', 500.00, NULL, 25, 1.5);

-- Create function to calculate and award donation points
CREATE OR REPLACE FUNCTION calculate_donation_points(
  p_donation_id VARCHAR(255),
  p_user_id VARCHAR(255),
  p_amount DECIMAL(10, 2),
  p_is_recurring BOOLEAN
) RETURNS INTEGER AS $$
DECLARE
  v_rule_id INTEGER;
  v_points INTEGER;
  v_multiplier DECIMAL(5, 2) := 1.0;
  v_campaign_multiplier DECIMAL(5, 2) := 1.0;
  v_campaign_id VARCHAR(255) := NULL;
BEGIN
  -- Find applicable rule
  SELECT id INTO v_rule_id
  FROM donation_point_rules
  WHERE min_amount <= p_amount AND (max_amount IS NULL OR max_amount >= p_amount)
  AND is_active = TRUE
  ORDER BY min_amount DESC
  LIMIT 1;

  -- Check for active campaign
  SELECT id, point_multiplier INTO v_campaign_id, v_campaign_multiplier
  FROM donation_campaigns
  WHERE is_active = TRUE
  AND start_date <= NOW()
  AND (end_date IS NULL OR end_date >= NOW())
  ORDER BY point_multiplier DESC
  LIMIT 1;

  -- Calculate points
  SELECT 
    FLOOR(p_amount * points_per_dollar * 
      CASE WHEN p_is_recurring THEN recurring_multiplier ELSE 1 END * 
      v_campaign_multiplier
    )::INTEGER
  INTO v_points
  FROM donation_point_rules
  WHERE id = v_rule_id;

  -- If no rule found, use default 10 points per dollar
  IF v_points IS NULL THEN
    v_points := FLOOR(p_amount * 10 * CASE WHEN p_is_recurring THEN 1.5 ELSE 1 END * v_campaign_multiplier)::INTEGER;
  END IF;

  -- Insert points record
  INSERT INTO donation_points (
    user_id, 
    donation_id, 
    points, 
    rule_id, 
    is_recurring
  ) VALUES (
    p_user_id,
    p_donation_id,
    v_points,
    v_rule_id,
    p_is_recurring
  );

  -- Update user's total points
  UPDATE users
  SET 
    donation_points = COALESCE(donation_points, 0) + v_points,
    updated_at = NOW()
  WHERE id = p_user_id;

  RETURN v_points;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically award points when a donation is completed
CREATE OR REPLACE FUNCTION donation_completed_trigger() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
    PERFORM calculate_donation_points(
      NEW.payment_id,
      NEW.donor_id,
      NEW.amount,
      NEW.subscription_id IS NOT NULL
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to donations table
DROP TRIGGER IF EXISTS donation_completed ON donations;
CREATE TRIGGER donation_completed
AFTER UPDATE OR INSERT ON donations
FOR EACH ROW
EXECUTE FUNCTION donation_completed_trigger();
