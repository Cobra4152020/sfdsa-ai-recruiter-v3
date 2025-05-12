-- Create performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id SERIAL PRIMARY KEY,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  rating VARCHAR(50) NOT NULL,
  path VARCHAR(255),
  user_agent TEXT,
  navigation_type VARCHAR(50),
  metric_id VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_path ON performance_metrics(path);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Create view for aggregated metrics by page
CREATE OR REPLACE VIEW performance_metrics_by_page AS
SELECT 
  path,
  metric_name,
  COUNT(*) as sample_count,
  AVG(metric_value) as avg_value,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value) as p75_value,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) as p95_value,
  MIN(metric_value) as min_value,
  MAX(metric_value) as max_value,
  MODE() WITHIN GROUP (ORDER BY rating) as common_rating,
  DATE_TRUNC('day', timestamp) as day
FROM performance_metrics
GROUP BY path, metric_name, DATE_TRUNC('day', timestamp);

-- Create view for daily metrics
CREATE OR REPLACE VIEW performance_metrics_daily AS
SELECT 
  metric_name,
  COUNT(*) as sample_count,
  AVG(metric_value) as avg_value,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value) as p75_value,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) as p95_value,
  MIN(metric_value) as min_value,
  MAX(metric_value) as max_value,
  MODE() WITHIN GROUP (ORDER BY rating) as common_rating,
  DATE_TRUNC('day', timestamp) as day
FROM performance_metrics
GROUP BY metric_name, DATE_TRUNC('day', timestamp);

-- Create function to clean up old metrics (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_performance_metrics()
RETURNS void AS $$
BEGIN
  -- Delete metrics older than 30 days
  DELETE FROM performance_metrics
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run the cleanup function daily
-- Note: This requires pg_cron extension to be enabled
-- If pg_cron is not available, you can run this manually or through an external scheduler
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('0 0 * * *', 'SELECT cleanup_old_performance_metrics()');
  END IF;
END $$;
