-- Create table for recruiter activities and points
CREATE TABLE IF NOT EXISTS recruiter_activities (
  id SERIAL PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  points INT NOT NULL,
  metadata JSONB,
  recruit_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for available rewards
CREATE TABLE IF NOT EXISTS recruiter_rewards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  points_required INT NOT NULL,
  reward_type VARCHAR(50) NOT NULL, -- e.g., "badge", "certificate", "gift_card", "merchandise", "feature"
  is_active BOOLEAN DEFAULT TRUE,
  max_redemptions INT, -- NULL means unlimited
  redemptions_count INT DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for reward redemptions
CREATE TABLE IF NOT EXISTS recruiter_reward_redemptions (
  id SERIAL PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id INT NOT NULL REFERENCES recruiter_rewards(id) ON DELETE CASCADE,
  points_spent INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, fulfilled, cancelled
  redemption_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfillment_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  notes TEXT
);

-- Create table for recruiter tiers/levels
CREATE TABLE IF NOT EXISTS recruiter_tiers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  points_required INT NOT NULL,
  benefits TEXT[],
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create view for recruiter leaderboard
CREATE OR REPLACE VIEW recruiter_leaderboard AS
SELECT 
  u.id as recruiter_id,
  u.name,
  u.email,
  u.avatar_url,
  COALESCE(SUM(ra.points), 0) as total_points,
  COUNT(DISTINCT CASE WHEN ra.activity_type = 'referral_signup' THEN ra.recruit_id END) as referral_signups,
  COUNT(DISTINCT CASE WHEN ra.activity_type = 'referral_application' THEN ra.recruit_id END) as referral_applications,
  COUNT(DISTINCT CASE WHEN ra.activity_type = 'referral_interview' THEN ra.recruit_id END) as referral_interviews,
  COUNT(DISTINCT CASE WHEN ra.activity_type = 'referral_hire' THEN ra.recruit_id END) as referral_hires,
  COUNT(DISTINCT rr.id) as rewards_redeemed,
  (SELECT name FROM recruiter_tiers rt 
   WHERE rt.points_required <= COALESCE(SUM(ra.points), 0) 
   ORDER BY rt.points_required DESC LIMIT 1) as current_tier
FROM 
  auth.users u
LEFT JOIN 
  recruiter_activities ra ON u.id = ra.recruiter_id
LEFT JOIN 
  recruiter_reward_redemptions rrd ON u.id = rrd.recruiter_id  
LEFT JOIN 
  recruiter_rewards rr ON rrd.reward_id = rr.id
WHERE 
  EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = u.id AND up.is_volunteer_recruiter = TRUE)
GROUP BY 
  u.id, u.name, u.email, u.avatar_url;

-- Insert some initial tier levels
INSERT INTO recruiter_tiers (name, description, points_required, benefits, image_url)
VALUES 
  ('Bronze Recruiter', 'Beginning level for volunteer recruiters', 0, 
   ARRAY['Access to referral tracking', 'Basic analytics dashboard'], '/recruiter-tiers/bronze.png'),
  ('Silver Recruiter', 'Intermediate level with additional benefits', 1000, 
   ARRAY['Access to referral tracking', 'Advanced analytics dashboard', 'Personalized referral links', 'Recognition on website'], '/recruiter-tiers/silver.png'),
  ('Gold Recruiter', 'Advanced level with premium benefits', 5000, 
   ARRAY['Access to referral tracking', 'Advanced analytics dashboard', 'Personalized referral links', 'Recognition on website', 'Invitation to quarterly recognition events', 'Priority support'], '/recruiter-tiers/gold.png'),
  ('Platinum Recruiter', 'Expert level with exclusive benefits', 15000, 
   ARRAY['Access to referral tracking', 'Advanced analytics dashboard', 'Personalized referral links', 'Featured recognition on website', 'Invitation to all department events', 'Priority support', 'Exclusive merchandise', 'One-on-one mentoring program'], '/recruiter-tiers/platinum.png');

-- Insert initial rewards
INSERT INTO recruiter_rewards (name, description, points_required, reward_type, image_url)
VALUES
  ('Digital Certificate', 'Digital certificate of recognition as a valuable volunteer recruiter', 500, 'certificate', '/recruiter-rewards/certificate.png'),
  ('SFSD Coffee Mug', 'Exclusive San Francisco Sheriff''s Department coffee mug', 1000, 'merchandise', '/recruiter-rewards/mug.png'),
  ('SFSD T-Shirt', 'Custom San Francisco Sheriff''s Department t-shirt', 2000, 'merchandise', '/recruiter-rewards/tshirt.png'),
  ('Featured Recruiter', 'Be featured on the department website as a top recruiter', 3000, 'feature', '/recruiter-rewards/featured.png'),
  ('Department Store Gift Card ($50)', '$50 gift card for the department store', 5000, 'gift_card', '/recruiter-rewards/gift-card.png'),
  ('Department Store Gift Card ($100)', '$100 gift card for the department store', 10000, 'gift_card', '/recruiter-rewards/gift-card.png'),
  ('VIP Tour & Lunch', 'VIP tour of the facilities and lunch with department leadership', 15000, 'experience', '/recruiter-rewards/vip.png');

-- Update the volunteer_referrals table to include a points column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'volunteer_referrals' 
    AND column_name = 'points_awarded'
  ) THEN
    ALTER TABLE volunteer_referrals ADD COLUMN points_awarded INT DEFAULT 0;
  END IF;
END
$$;
