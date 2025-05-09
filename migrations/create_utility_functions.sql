-- Function to check if another function exists
CREATE OR REPLACE FUNCTION function_exists(function_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM pg_proc
    WHERE proname = function_name
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create an index if it doesn't exist
CREATE OR REPLACE FUNCTION create_index_if_not_exists(
  index_name TEXT,
  table_name TEXT,
  column_name TEXT
)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = index_name
  ) THEN
    EXECUTE format('CREATE INDEX %I ON %I(%I)', 
                  index_name, table_name, column_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create a function from a string
CREATE OR REPLACE FUNCTION create_function(function_definition TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE function_definition;
END;
$$ LANGUAGE plpgsql;
