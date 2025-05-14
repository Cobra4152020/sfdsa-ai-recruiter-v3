-- Create a simple health check table
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB
);

-- Insert some initial data
INSERT INTO health_check (name, status, details)
VALUES 
  ('api', 'ok', '{"message": "API is operational"}'),
  ('database', 'ok', '{"message": "Database connection successful"}'),
  ('email', 'ok', '{"message": "Email service is operational"}')
ON CONFLICT (id) DO NOTHING;

-- Create a function to update the health check status
CREATE OR REPLACE FUNCTION update_health_check(
  p_name VARCHAR,
  p_status VARCHAR,
  p_details JSONB
) RETURNS VOID AS $$
BEGIN
  INSERT INTO health_check (name, status, last_checked, details)
  VALUES (p_name, p_status, NOW(), p_details)
  ON CONFLICT (name) DO UPDATE
  SET status = p_status,
      last_checked = NOW(),
      details = p_details;
END;
$$ LANGUAGE plpgsql;
