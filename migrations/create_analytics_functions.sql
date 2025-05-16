-- Function to get user growth data
CREATE OR REPLACE FUNCTION get_user_growth_data(
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  period_interval TEXT
)
RETURNS TABLE (
  date TEXT,
  total BIGINT,
  recruits BIGINT,
  volunteers BIGINT
) AS $$
DECLARE
  interval_sql TEXT;
BEGIN
  -- Set the appropriate date truncation based on the period
  CASE period_interval
    WHEN 'week' THEN interval_sql := 'day';
    WHEN 'month' THEN interval_sql := 'day';
    WHEN 'quarter' THEN interval_sql := 'week';
    WHEN 'year' THEN interval_sql := 'month';
    ELSE interval_sql := 'day';
  END CASE;

  RETURN QUERY
  WITH dates AS (
    SELECT 
      date_trunc(interval_sql, d)::date AS date
    FROM 
      generate_series(start_date::date, end_date::date, '1 ' || interval_sql) d
  ),
  user_counts AS (
    SELECT
      date_trunc(interval_sql, ut.created_at)::date AS date,
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE ut.user_type = 'recruit') AS recruits,
      COUNT(*) FILTER (WHERE ut.user_type = 'volunteer') AS volunteers
    FROM
      user_types ut
    WHERE
      ut.created_at BETWEEN start_date AND end_date
    GROUP BY
      date_trunc(interval_sql, ut.created_at)::date
  )
  SELECT
    to_char(d.date, 'YYYY-MM-DD') AS date,
    COALESCE(uc.total, 0) AS total,
    COALESCE(uc.recruits, 0) AS recruits,
    COALESCE(uc.volunteers, 0) AS volunteers
  FROM
    dates d
  LEFT JOIN
    user_counts uc ON d.date = uc.date
  ORDER BY
    d.date;
END;
$$ LANGUAGE plpgsql;

-- Function to get user engagement data
CREATE OR REPLACE FUNCTION get_user_engagement_data(
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  period_interval TEXT
)
RETURNS TABLE (
  date TEXT,
  active_users BIGINT,
  average_session_time NUMERIC,
  interactions BIGINT
) AS $$
DECLARE
  interval_sql TEXT;
BEGIN
  -- Set the appropriate date truncation based on the period
  CASE period_interval
    WHEN 'week' THEN interval_sql := 'day';
    WHEN 'month' THEN interval_sql := 'day';
    WHEN 'quarter' THEN interval_sql := 'week';
    WHEN 'year' THEN interval_sql := 'month';
    ELSE interval_sql := 'day';
  END CASE;

  RETURN QUERY
  WITH dates AS (
    SELECT 
      date_trunc(interval_sql, d)::date AS date
    FROM 
      generate_series(start_date::date, end_date::date, '1 ' || interval_sql) d
  ),
  engagement_data AS (
    SELECT
      date_trunc(interval_sql, pm.created_at)::date AS date,
      COUNT(DISTINCT pm.user_id) AS active_users,
      AVG(pm.session_duration) AS average_session_time,
      COUNT(*) AS interactions
    FROM
      performance_metrics pm
    WHERE
      pm.created_at BETWEEN start_date AND end_date
    GROUP BY
      date_trunc(interval_sql, pm.created_at)::date
  )
  SELECT
    to_char(d.date, 'YYYY-MM-DD') AS date,
    COALESCE(ed.active_users, 0) AS active_users,
    COALESCE(ed.average_session_time, 0) AS average_session_time,
    COALESCE(ed.interactions, 0) AS interactions
  FROM
    dates d
  LEFT JOIN
    engagement_data ed ON d.date = ed.date
  ORDER BY
    d.date;
END;
$$ LANGUAGE plpgsql;

-- Function to get volunteer conversion data
CREATE OR REPLACE FUNCTION get_volunteer_conversion_data(
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  result_limit INTEGER
)
RETURNS TABLE (
  volunteer_id UUID,
  volunteer_name TEXT,
  referrals BIGINT,
  conversions BIGINT,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH referral_data AS (
    SELECT
      vr.referrer_id AS volunteer_id,
      CONCAT(vr2.first_name, ' ', vr2.last_name) AS volunteer_name,
      COUNT(*) AS referrals,
      COUNT(*) FILTER (WHERE ru.id IS NOT NULL) AS conversions
    FROM
      volunteer_referrals vr
    JOIN
      volunteer.recruiters vr2 ON vr.referrer_id = vr2.id
    LEFT JOIN
      recruit.users ru ON vr.referred_id = ru.id
    WHERE
      vr.created_at BETWEEN start_date AND end_date
    GROUP BY
      vr.referrer_id, volunteer_name
  )
  SELECT
    rd.volunteer_id,
    rd.volunteer_name,
    rd.referrals,
    rd.conversions,
    CASE 
      WHEN rd.referrals > 0 THEN (rd.conversions::NUMERIC / rd.referrals) * 100
      ELSE 0
    END AS conversion_rate
  FROM
    referral_data rd
  ORDER BY
    conversion_rate DESC, referrals DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get geographic distribution
CREATE OR REPLACE FUNCTION get_geographic_distribution(
  user_type TEXT DEFAULT 'all'
)
RETURNS TABLE (
  zip_code TEXT,
  count BIGINT,
  latitude NUMERIC,
  longitude NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH recruit_zips AS (
    SELECT
      zip_code,
      COUNT(*) AS count
    FROM
      recruit.users
    WHERE
      zip_code IS NOT NULL AND
      (user_type = 'all' OR user_type = 'recruit')
    GROUP BY
      zip_code
  ),
  volunteer_zips AS (
    SELECT
      zip_code,
      COUNT(*) AS count
    FROM
      volunteer.recruiters
    WHERE
      zip_code IS NOT NULL AND
      (user_type = 'all' OR user_type = 'volunteer')
    GROUP BY
      zip_code
  ),
  combined_zips AS (
    SELECT
      zip_code,
      count
    FROM
      recruit_zips
    UNION ALL
    SELECT
      zip_code,
      count
    FROM
      volunteer_zips
  ),
  aggregated_zips AS (
    SELECT
      zip_code,
      SUM(count) AS count
    FROM
      combined_zips
    GROUP BY
      zip_code
  )
  SELECT
    az.zip_code,
    az.count,
    zc.latitude,
    zc.longitude
  FROM
    aggregated_zips az
  LEFT JOIN
    zip_codes zc ON az.zip_code = zc.zip_code
  ORDER BY
    az.count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user retention data
CREATE OR REPLACE FUNCTION get_user_retention_data(
  start_date TIMESTAMP,
  end_date TIMESTAMP
)
RETURNS TABLE (
  cohort TEXT,
  users BIGINT,
  week1 NUMERIC,
  week2 NUMERIC,
  week3 NUMERIC,
  week4 NUMERIC,
  week5 NUMERIC,
  week6 NUMERIC,
  week7 NUMERIC,
  week8 NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH cohorts AS (
    SELECT
      date_trunc('month', created_at)::date AS cohort_date,
      user_id
    FROM
      user_types
    WHERE
      created_at BETWEEN start_date AND end_date
  ),
  user_activities AS (
    SELECT
      user_id,
      date_trunc('day', created_at)::date AS activity_date
    FROM
      performance_metrics
    WHERE
      created_at BETWEEN start_date AND (end_date + interval '8 weeks')
    GROUP BY
      user_id, date_trunc('day', created_at)::date
  ),
  cohort_size AS (
    SELECT
      cohort_date,
      COUNT(DISTINCT user_id) AS users
    FROM
      cohorts
    GROUP BY
      cohort_date
  ),
  retention_data AS (
    SELECT
      c.cohort_date,
      EXTRACT(WEEK FROM ua.activity_date - c.cohort_date)::int AS week_number,
      COUNT(DISTINCT c.user_id) AS active_users
    FROM
      cohorts c
    JOIN
      user_activities ua ON c.user_id = ua.user_id
    WHERE
      ua.activity_date >= c.cohort_date AND
      EXTRACT(WEEK FROM ua.activity_date - c.cohort_date) <= 8
    GROUP BY
      c.cohort_date, week_number
  ),
  retention_pivot AS (
    SELECT
      rd.cohort_date,
      cs.users,
      MAX(CASE WHEN rd.week_number = 1 THEN (rd.active_users::numeric / cs.users) * 100 ELSE 0 END) AS week1,
      MAX(CASE WHEN rd.week_number = 2 THEN (rd.active_users::numeric / cs.users) * 100 ELSE 0 END) AS week2,
      MAX(CASE WHEN rd.week_number = 3 THEN (rd.active_users::numeric / cs.users) * 100 ELSE 0 END) AS week3,
      MAX(CASE WHEN rd.week_number = 4 THEN (rd.active_users::numeric / cs.users) * 100 ELSE 0 END) AS week4,
      MAX(CASE WHEN rd.week_number = 5 THEN (rd.active_users::numeric / cs.users) * 100 ELSE 0 END) AS week5,
      MAX(CASE WHEN rd.week_number = 6 THEN (rd.active_users::numeric / cs.users) * 100 ELSE 0 END) AS week6,
      MAX(CASE WHEN rd.week_number = 7 THEN (rd.active_users::numeric / cs.users) * 100 ELSE 0 END) AS week7,
      MAX(CASE WHEN rd.week_number = 8 THEN (rd.active_users::numeric / cs.users) * 100 ELSE 0 END) AS week8
    FROM
      retention_data rd
    JOIN
      cohort_size cs ON rd.cohort_date = cs.cohort_date
    GROUP BY
      rd.cohort_date, cs.users
  )
  SELECT
    to_char(cohort_date, 'YYYY-MM') AS cohort,
    users,
    week1,
    week2,
    week3,
    week4,
    week5,
    week6,
    week7,
    week8
  FROM
    retention_pivot
  ORDER BY
    cohort_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get badge distribution data
CREATE OR REPLACE FUNCTION get_badge_distribution_data()
RETURNS TABLE (
  badge_id UUID,
  badge_name TEXT,
  count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_badges BIGINT;
BEGIN
  -- Get total number of badges awarded
  SELECT COUNT(*) INTO total_badges FROM user_badges;
  
  RETURN QUERY
  SELECT
    b.id AS badge_id,
    b.name AS badge_name,
    COUNT(ub.user_id) AS count,
    CASE 
      WHEN total_badges > 0 THEN (COUNT(ub.user_id)::NUMERIC / total_badges) * 100
      ELSE 0
    END AS percentage
  FROM
    badges b
  LEFT JOIN
    user_badges ub ON b.id = ub.badge_id
  GROUP BY
    b.id, b.name
  ORDER BY
    count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(
  start_date TIMESTAMP,
  end_date TIMESTAMP
)
RETURNS TABLE (
  activity_type TEXT,
  count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_activities BIGINT;
BEGIN
  -- Get total number of activities in the period
  SELECT COUNT(*) INTO total_activities 
  FROM user_activities 
  WHERE created_at BETWEEN start_date AND end_date;
  
  RETURN QUERY
  SELECT
    ua.activity_type,
    COUNT(*) AS count,
    CASE 
      WHEN total_activities > 0 THEN (COUNT(*)::NUMERIC / total_activities) * 100
      ELSE 0
    END AS percentage
  FROM
    user_activities ua
  WHERE
    ua.created_at BETWEEN start_date AND end_date
  GROUP BY
    ua.activity_type
  ORDER BY
    count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to generate monthly report
CREATE OR REPLACE FUNCTION generate_monthly_report(
  start_date TIMESTAMP,
  end_date TIMESTAMP
)
RETURNS JSON AS $$
DECLARE
  report_data JSON;
BEGIN
  WITH monthly_stats AS (
    -- New users
    SELECT
      COUNT(*) FILTER (WHERE created_at BETWEEN start_date AND end_date) AS new_users,
      COUNT(*) FILTER (WHERE created_at BETWEEN start_date AND end_date AND user_type = 'recruit') AS new_recruits,
      COUNT(*) FILTER (WHERE created_at BETWEEN start_date AND end_date AND user_type = 'volunteer') AS new_volunteers
    FROM
      user_types
  ),
  activity_stats AS (
    -- User activity
    SELECT
      COUNT(DISTINCT user_id) AS active_users,
      COUNT(*) AS total_activities,
      AVG(points) AS avg_points_per_activity
    FROM
      user_activities
    WHERE
      created_at BETWEEN start_date AND end_date
  ),
  badge_stats AS (
    -- Badge awards
    SELECT
      COUNT(*) AS badges_awarded,
      COUNT(DISTINCT user_id) AS users_with_badges
    FROM
      user_badges
    WHERE
      awarded_at BETWEEN start_date AND end_date
  ),
  referral_stats AS (
    -- Referrals
    SELECT
      COUNT(*) AS total_referrals,
      COUNT(DISTINCT referrer_id) AS active_recruiters
    FROM
      volunteer_referrals
    WHERE
      created_at BETWEEN start_date AND end_date
  ),
  conversion_stats AS (
    -- Conversions from referrals to applications
    SELECT
      COUNT(*) AS total_conversions
    FROM
      volunteer_referrals vr
    JOIN
      recruit.users ru ON vr.referred_id = ru.id
    WHERE
      vr.created_at BETWEEN start_date AND end_date
  ),
  top_recruiters AS (
    -- Top 5 recruiters
    SELECT
      vr.referrer_id,
      CONCAT(vr2.first_name, ' ', vr2.last_name) AS recruiter_name,
      COUNT(*) AS referrals
    FROM
      volunteer_referrals vr
    JOIN
      volunteer.recruiters vr2 ON vr.referrer_id = vr2.id
    WHERE
      vr.created_at BETWEEN start_date AND end_date
    GROUP BY
      vr.referrer_id, recruiter_name
    ORDER BY
      referrals DESC
    LIMIT 5
  ),
  top_badges AS (
    -- Top 5 badges awarded
    SELECT
      b.id,
      b.name,
      COUNT(*) AS awards
    FROM
      user_badges ub
    JOIN
      badges b ON ub.badge_id = b.id
    WHERE
      ub.awarded_at BETWEEN start_date AND end_date
    GROUP BY
      b.id, b.name
    ORDER BY
      awards DESC
    LIMIT 5
  )
  SELECT
    json_build_object(
      'period', json_build_object(
        'start_date', start_date,
        'end_date', end_date
      ),
      'user_growth', json_build_object(
        'new_users', ms.new_users,
        'new_recruits', ms.new_recruits,
        'new_volunteers', ms.new_volunteers
      ),
      'engagement', json_build_object(
        'active_users', ast.active_users,
        'total_activities', ast.total_activities,
        'avg_points_per_activity', ast.avg_points_per_activity
      ),
      'badges', json_build_object(
        'badges_awarded', bs.badges_awarded,
        'users_with_badges', bs.users_with_badges
      ),
      'referrals', json_build_object(
        'total_referrals', rs.total_referrals,
        'active_recruiters', rs.active_recruiters,
        'total_conversions', cs.total_conversions,
        'conversion_rate', CASE WHEN rs.total_referrals > 0 THEN (cs.total_conversions::NUMERIC / rs.total_referrals) * 100 ELSE 0 END
      ),
      'top_recruiters', (
        SELECT json_agg(
          json_build_object(
            'id', tr.referrer_id,
            'name', tr.recruiter_name,
            'referrals', tr.referrals
          )
        )
        FROM top_recruiters tr
      ),
      'top_badges', (
        SELECT json_agg(
          json_build_object(
            'id', tb.id,
            'name', tb.name,
            'awards', tb.awards
          )
        )
        FROM top_badges tb
      )
    ) INTO report_data
  FROM
    monthly_stats ms,
    activity_stats ast,
    badge_stats bs,
    referral_stats rs,
    conversion_stats cs;
    
  RETURN report_data;
END;
$$ LANGUAGE plpgsql;

-- Create a table to store zip codes with latitude and longitude
CREATE TABLE IF NOT EXISTS zip_codes (
  zip_code TEXT PRIMARY KEY,
  city TEXT,
  state TEXT,
  latitude NUMERIC,
  longitude NUMERIC
);

-- Add some sample data for San Francisco area zip codes
INSERT INTO zip_codes (zip_code, city, state, latitude, longitude)
VALUES
  ('94102', 'San Francisco', 'CA', 37.7813, -122.4167),
  ('94103', 'San Francisco', 'CA', 37.7724, -122.4104),
  ('94104', 'San Francisco', 'CA', 37.7915, -122.4016),
  ('94105', 'San Francisco', 'CA', 37.7897, -122.3889),
  ('94107', 'San Francisco', 'CA', 37.7697, -122.3933),
  ('94108', 'San Francisco', 'CA', 37.7946, -122.4079),
  ('94109', 'San Francisco', 'CA', 37.7957, -122.4209),
  ('94110', 'San Francisco', 'CA', 37.7503, -122.4153),
  ('94111', 'San Francisco', 'CA', 37.7989, -122.3984),
  ('94112', 'San Francisco', 'CA', 37.7192, -122.4425),
  ('94114', 'San Francisco', 'CA', 37.7587, -122.4332),
  ('94115', 'San Francisco', 'CA', 37.7856, -122.4368),
  ('94116', 'San Francisco', 'CA', 37.7441, -122.4863),
  ('94117', 'San Francisco', 'CA', 37.7712, -122.4413),
  ('94118', 'San Francisco', 'CA', 37.7811, -122.4639),
  ('94121', 'San Francisco', 'CA', 37.7786, -122.4892),
  ('94122', 'San Francisco', 'CA', 37.7593, -122.4836),
  ('94123', 'San Francisco', 'CA', 37.8002, -122.4378),
  ('94124', 'San Francisco', 'CA', 37.7312, -122.3826),
  ('94127', 'San Francisco', 'CA', 37.7349, -122.4586),
  ('94129', 'San Francisco', 'CA', 37.7988, -122.4662),
  ('94130', 'San Francisco', 'CA', 37.8264, -122.3728),
  ('94131', 'San Francisco', 'CA', 37.7454, -122.4398),
  ('94132', 'San Francisco', 'CA', 37.7219, -122.4782),
  ('94133', 'San Francisco', 'CA', 37.8002, -122.4091),
  ('94134', 'San Francisco', 'CA', 37.7192, -122.4059),
  ('94158', 'San Francisco', 'CA', 37.7694, -122.3889)
ON CONFLICT (zip_code) DO NOTHING;
