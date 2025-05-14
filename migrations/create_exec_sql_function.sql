-- Function to execute SQL safely with params from service role only
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT, params_array TEXT[] DEFAULT '{}')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can only be executed by service role
  IF NOT (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role') THEN
    RAISE EXCEPTION 'Permission denied: only service_role can execute this function';
  END IF;

  -- Execute the SQL dynamically with the params
  EXECUTE sql_query USING params_array;
END;
$$;

-- Grant execute permission to authenticated users (the check is inside the function)
GRANT EXECUTE ON FUNCTION public.exec_sql TO authenticated;
GRANT EXECUTE ON FUNCTION public.exec_sql TO service_role;
