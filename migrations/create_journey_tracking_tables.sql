-- Create table for storing journey data
CREATE TABLE IF NOT EXISTS performance_journeys (
  id SERIAL PRIMARY KEY,
  journey_id UUID NOT NULL,
  journey_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  user_id UUID,
  session_id UUID NOT NULL,
  step_count INTEGER NOT NULL DEFAULT 0,
  total_duration DOUBLE PRECISION,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on journey_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_performance_journeys_journey_id ON performance_journeys(journey_id);
CREATE INDEX IF NOT EXISTS idx_performance_journeys_journey_name ON performance_journeys(journey_name);
CREATE INDEX IF NOT EXISTS idx_performance_journeys_user_id ON performance_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_journeys_session_id ON performance_journeys(session_id);

-- Create table for storing journey steps
CREATE TABLE IF NOT EXISTS performance_journey_steps (
  id SERIAL PRIMARY KEY,
  journey_id UUID NOT NULL,
  step_name VARCHAR(255) NOT NULL,
  step_number INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  duration DOUBLE PRECISION,
  previous_step VARCHAR(255),
  user_id UUID,
  session_id UUID NOT NULL,
  metrics JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on journey_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_performance_journey_steps_journey_id ON performance_journey_steps(journey_id);
CREATE INDEX IF NOT EXISTS idx_performance_journey_steps_step_name ON performance_journey_steps(step_name);
CREATE INDEX IF NOT EXISTS idx_performance_journey_steps_user_id ON performance_journey_steps(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_journey_steps_session_id ON performance_journey_steps(session_id);

-- Create view for journey analytics
CREATE OR REPLACE VIEW journey_performance_summary AS
SELECT
  j.journey_name,
  COUNT(*) AS total_journeys,
  SUM(CASE WHEN j.completed THEN 1 ELSE 0 END) AS completed_journeys,
  SUM(CASE WHEN NOT j.completed THEN 1 ELSE 0 END) AS abandoned_journeys,
  ROUND(AVG(j.total_duration)::numeric, 2) AS avg_duration,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY j.total_duration) AS median_duration,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY j.total_duration) AS p95_duration,
  MIN(j.total_duration) AS min_duration,
  MAX(j.total_duration) AS max_duration,
  AVG(j.step_count)::numeric(10,1) AS avg_steps,
  COUNT(DISTINCT j.user_id) AS unique_users,
  COUNT(DISTINCT j.session_id) AS unique_sessions
FROM
  performance_journeys j
WHERE
  j.total_duration IS NOT NULL
GROUP BY
  j.journey_name;

-- Create view for step analytics
CREATE OR REPLACE VIEW journey_step_performance AS
SELECT
  s.journey_id,
  j.journey_name,
  s.step_name,
  s.step_number,
  COUNT(*) AS occurrences,
  ROUND(AVG(s.duration)::numeric, 2) AS avg_duration,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY s.duration) AS median_duration,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY s.duration) AS p95_duration,
  MIN(s.duration) AS min_duration,
  MAX(s.duration) AS max_duration
FROM
  performance_journey_steps s
JOIN
  performance_journeys j ON s.journey_id = j.journey_id
WHERE
  s.duration IS NOT NULL
GROUP BY
  s.journey_id, j.journey_name, s.step_name, s.step_number
ORDER BY
  j.journey_name, s.step_number;

-- Create view for journey funnel analysis
CREATE OR REPLACE VIEW journey_funnel_analysis AS
WITH step_counts AS (
  SELECT
    j.journey_name,
    s.step_number,
    s.step_name,
    COUNT(DISTINCT s.journey_id) AS step_count
  FROM
    performance_journey_steps s
  JOIN
    performance_journeys j ON s.journey_id = j.journey_id
  GROUP BY
    j.journey_name, s.step_number, s.step_name
),
journey_totals AS (
  SELECT
    journey_name,
    COUNT(DISTINCT journey_id) AS total_journeys
  FROM
    performance_journeys
  GROUP BY
    journey_name
)
SELECT
  sc.journey_name,
  sc.step_number,
  sc.step_name,
  sc.step_count,
  jt.total_journeys,
  ROUND((sc.step_count::numeric / jt.total_journeys::numeric) * 100, 2) AS completion_rate,
  CASE
    WHEN LAG(sc.step_count) OVER (PARTITION BY sc.journey_name ORDER BY sc.step_number) IS NULL THEN 100
    ELSE ROUND((sc.step_count::numeric / LAG(sc.step_count) OVER (PARTITION BY sc.journey_name ORDER BY sc.step_number)::numeric) * 100, 2)
  END AS step_retention_rate
FROM
  step_counts sc
JOIN
  journey_totals jt ON sc.journey_name = jt.journey_name
ORDER BY
  sc.journey_name, sc.step_number;
