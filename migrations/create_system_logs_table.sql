-- Create a table for system logs
CREATE TABLE IF NOT EXISTS system_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  error_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS system_logs_timestamp_idx ON system_logs (timestamp);
CREATE INDEX IF NOT EXISTS system_logs_level_idx ON system_logs (level);
CREATE INDEX IF NOT EXISTS system_logs_context_idx ON system_logs USING GIN (context);

-- Create a function to clean up old logs (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
  -- Keep logs for 30 days by default, but keep error and critical logs longer (90 days)
  DELETE FROM system_logs 
  WHERE 
    (level NOT IN ('error', 'critical') AND timestamp < NOW() - INTERVAL '30 days')
    OR (level IN ('error', 'critical') AND timestamp < NOW() - INTERVAL '90 days');
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run the cleanup function daily
-- This requires pg_cron extension to be enabled
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    PERFORM cron.schedule('0 3 * * *', 'SELECT cleanup_old_logs()');
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- If pg_cron is not available, we'll skip the scheduled job
  RAISE NOTICE 'pg_cron extension not available, skipping scheduled cleanup job';
END $$;

-- Create a view for recent errors
CREATE OR REPLACE VIEW recent_errors AS
SELECT * FROM system_logs
WHERE level IN ('error', 'critical')
ORDER BY timestamp DESC
LIMIT 100;
