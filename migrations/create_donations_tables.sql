-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  donor_email VARCHAR(255),
  donor_name VARCHAR(255),
  payment_processor VARCHAR(50) NOT NULL,
  payment_id VARCHAR(255) NOT NULL,
  subscription_id VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table for recurring donations
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  subscription_id VARCHAR(255) NOT NULL,
  donor_id VARCHAR(255),
  donor_email VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  interval VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donation analytics table
CREATE TABLE IF NOT EXISTS donation_analytics (
  id SERIAL PRIMARY KEY,
  payment_id VARCHAR(255),
  amount DECIMAL(10, 2),
  payment_method_type VARCHAR(50),
  event_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_donations_payment_id ON donations(payment_id);
CREATE INDEX IF NOT EXISTS idx_donations_subscription_id ON donations(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscription_id ON subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);

-- Create function to get donation statistics
CREATE OR REPLACE FUNCTION get_donation_statistics(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  total_donations BIGINT,
  total_amount DECIMAL(10, 2),
  recurring_donors BIGINT,
  average_donation DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) AS total_donations,
      SUM(amount) AS total_amount,
      COUNT(DISTINCT donor_email) AS unique_donors,
      AVG(amount) AS average_donation
    FROM donations
    WHERE 
      status = 'completed'
      AND (start_date IS NULL OR created_at >= start_date)
      AND (end_date IS NULL OR created_at <= end_date)
  ),
  recurring AS (
    SELECT COUNT(DISTINCT donor_email) AS recurring_donors
    FROM subscriptions
    WHERE 
      status = 'active'
      AND (start_date IS NULL OR created_at >= start_date)
      AND (end_date IS NULL OR created_at <= end_date)
  )
  SELECT
    stats.total_donations,
    stats.total_amount,
    recurring.recurring_donors,
    stats.average_donation
  FROM stats, recurring;
END;
$$ LANGUAGE plpgsql;
