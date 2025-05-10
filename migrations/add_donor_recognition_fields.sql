-- Add recognition fields to donations table
ALTER TABLE donations
ADD COLUMN allow_recognition BOOLEAN DEFAULT FALSE,
ADD COLUMN recognition_tier VARCHAR(50),
ADD COLUMN display_name VARCHAR(255);

-- Create a view for the donor recognition wall
CREATE OR REPLACE VIEW donor_recognition_view AS
SELECT
  d.id,
  COALESCE(d.display_name, CASE WHEN d.is_anonymous THEN 'Anonymous Donor' ELSE d.donor_name END) AS name,
  d.amount,
  d.donation_message AS message,
  d.created_at AS donation_date,
  d.recognition_tier AS tier,
  d.is_recurring,
  o.name AS organization
FROM
  donations d
LEFT JOIN
  organizations o ON d.organization_id = o.id
WHERE
  d.allow_recognition = TRUE
  AND d.status = 'completed';

-- Create a function to update the recognition tier based on amount
CREATE OR REPLACE FUNCTION update_recognition_tier()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount >= 1000 THEN
    NEW.recognition_tier := 'benefactor';
  ELSIF NEW.amount >= 500 THEN
    NEW.recognition_tier := 'champion';
  ELSIF NEW.amount >= 100 THEN
    NEW.recognition_tier := 'supporter';
  ELSE
    NEW.recognition_tier := 'friend';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set the recognition tier
CREATE TRIGGER set_recognition_tier
BEFORE INSERT OR UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_recognition_tier();
