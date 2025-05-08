-- Create NFT award tiers table
CREATE TABLE IF NOT EXISTS nft_award_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  point_threshold INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user NFT awards table
CREATE TABLE IF NOT EXISTS user_nft_awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nft_award_id TEXT NOT NULL REFERENCES nft_award_tiers(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_at_award INTEGER NOT NULL,
  token_id TEXT,
  contract_address TEXT,
  transaction_hash TEXT,
  
  -- Ensure a user can only have one of each NFT award
  UNIQUE(user_id, nft_award_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS user_nft_awards_user_id_idx ON user_nft_awards(user_id);
CREATE INDEX IF NOT EXISTS user_nft_awards_nft_award_id_idx ON user_nft_awards(nft_award_id);

-- Insert default NFT award tiers
INSERT INTO nft_award_tiers (id, name, description, image_url, point_threshold)
VALUES
  ('bronze', 'Bronze Recruit', 'Awarded for reaching 1,000 participation points', '/nft-awards/bronze-recruit.png', 1000),
  ('silver', 'Silver Recruit', 'Awarded for reaching 2,500 participation points', '/nft-awards/silver-recruit.png', 2500),
  ('gold', 'Gold Recruit', 'Awarded for reaching 5,000 participation points', '/nft-awards/gold-recruit.png', 5000),
  ('platinum', 'Platinum Recruit', 'Awarded for reaching 10,000 participation points', '/nft-awards/platinum-recruit.png', 10000)
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  point_threshold = EXCLUDED.point_threshold;

-- Create function to check and award NFTs when participation points increase
CREATE OR REPLACE FUNCTION check_and_award_nfts()
RETURNS TRIGGER AS $$
DECLARE
  award_record RECORD;
BEGIN
  -- Only proceed if participation count has increased
  IF NEW.participation_count <= OLD.participation_count THEN
    RETURN NEW;
  END IF;
  
  -- Check each award tier
  FOR award_record IN 
    SELECT * FROM nft_award_tiers 
    WHERE point_threshold <= NEW.participation_count
    ORDER BY point_threshold DESC
  LOOP
    -- Check if user already has this award
    IF NOT EXISTS (
      SELECT 1 FROM user_nft_awards 
      WHERE user_id = NEW.id AND nft_award_id = award_record.id
    ) THEN
      -- Award the NFT
      INSERT INTO user_nft_awards (
        user_id, 
        nft_award_id, 
        points_at_award
      ) VALUES (
        NEW.id,
        award_record.id,
        NEW.participation_count
      );
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check and award NFTs when user is updated
CREATE TRIGGER check_nft_awards_on_user_update
AFTER UPDATE OF participation_count ON users
FOR EACH ROW
WHEN (NEW.participation_count > OLD.participation_count)
EXECUTE FUNCTION check_and_award_nfts();
