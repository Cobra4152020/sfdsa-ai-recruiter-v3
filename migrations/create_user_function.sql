-- Create a function to safely create a new user without materialized view permission issues
CREATE OR REPLACE FUNCTION create_new_user(
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  initial_points INTEGER DEFAULT 50
) RETURNS VOID AS $$
BEGIN
  -- Insert the new user
  INSERT INTO users (
    id,
    name,
    email,
    created_at,
    participation_count,
    has_applied
  ) VALUES (
    user_id,
    user_name,
    user_email,
    NOW(),
    initial_points,
    FALSE
  );
  
  -- Refresh the materialized view if it exists
  -- This is wrapped in a BEGIN/EXCEPTION block to handle the case where the view doesn't exist
  BEGIN
    REFRESH MATERIALIZED VIEW leaderboard_cache;
  EXCEPTION
    WHEN undefined_table THEN
      -- Do nothing if the view doesn't exist
      NULL;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION create_new_user TO anon;
GRANT EXECUTE ON FUNCTION create_new_user TO authenticated;
GRANT EXECUTE ON FUNCTION create_new_user TO service_role;
