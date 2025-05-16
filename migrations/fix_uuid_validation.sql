-- Add function to validate UUID format
CREATE OR REPLACE FUNCTION is_valid_uuid(str text)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN str ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
EXCEPTION
  WHEN others THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to ensure valid UUIDs
CREATE OR REPLACE FUNCTION validate_uuid_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_valid_uuid(NEW.id::text) THEN
    RAISE EXCEPTION 'Invalid UUID format for user id';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_user_uuid_before_insert
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION validate_uuid_before_insert();

-- Add trigger to ensure valid UUIDs for user_nft_awards
CREATE OR REPLACE FUNCTION validate_nft_award_uuid_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_valid_uuid(NEW.user_id::text) THEN
    RAISE EXCEPTION 'Invalid UUID format for user_id in user_nft_awards';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_nft_award_uuid_before_insert
BEFORE INSERT ON user_nft_awards
FOR EACH ROW
EXECUTE FUNCTION validate_nft_award_uuid_before_insert();

-- Function to convert invalid UUIDs to valid ones
CREATE OR REPLACE FUNCTION generate_uuid_from_string(str text)
RETURNS UUID AS $$
BEGIN
  -- Use MD5 to generate a deterministic UUID from the string
  RETURN md5(str)::uuid;
EXCEPTION
  WHEN others THEN
    -- If anything goes wrong, return a new random UUID
    RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql; 