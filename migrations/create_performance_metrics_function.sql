-- Function to create the performance_metrics table if it doesn't exist
CREATE OR REPLACE FUNCTION create_performance_metrics_table()
RETURNS void AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'performance_metrics'
  ) THEN
    -- Create the table
    CREATE TABLE public.performance_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      metric_name TEXT NOT NULL,
      metric_value DOUBLE PRECISION NOT NULL,
      rating TEXT NOT NULL,
      path TEXT,
      user_agent TEXT,
      navigation_type TEXT,
      metric_id TEXT,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    
    -- Create an index on timestamp for faster queries
    CREATE INDEX idx_performance_metrics_timestamp ON public.performance_metrics(timestamp);
    
    -- Create an index on metric_name for faster filtering
    CREATE INDEX idx_performance_metrics_name ON public.performance_metrics(metric_name);
  END IF;
END;
$$ LANGUAGE plpgsql;
