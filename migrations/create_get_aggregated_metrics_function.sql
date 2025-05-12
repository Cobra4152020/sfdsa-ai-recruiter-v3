-- Function to get aggregated metrics
CREATE OR REPLACE FUNCTION get_aggregated_metrics(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
RETURNS TABLE (
  metric_name TEXT,
  avg_value DOUBLE PRECISION,
  p75_value DOUBLE PRECISION,
  p95_value DOUBLE PRECISION,
  sample_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH metrics_data AS (
    SELECT 
      metric_name,
      metric_value,
      ROW_NUMBER() OVER (PARTITION BY metric_name ORDER BY metric_value) as row_num,
      COUNT(*) OVER (PARTITION BY metric_name) as total_count
    FROM performance_metrics
    WHERE timestamp >= start_date AND timestamp <= end_date
  )
  SELECT 
    md.metric_name,
    AVG(md.metric_value)::DOUBLE PRECISION as avg_value,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY md.metric_value)::DOUBLE PRECISION as p75_value,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY md.metric_value)::DOUBLE PRECISION as p95_value,
    COUNT(*)::BIGINT as sample_count
  FROM metrics_data md
  GROUP BY md.metric_name;
END;
$$ LANGUAGE plpgsql;
