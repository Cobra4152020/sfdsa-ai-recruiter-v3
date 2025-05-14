-- Create functions for donation analytics
CREATE OR REPLACE FUNCTION get_donation_trends(
  p_start_date TIMESTAMP DEFAULT (CURRENT_DATE - INTERVAL '30 days'),
  p_end_date TIMESTAMP DEFAULT CURRENT_DATE,
  p_interval TEXT DEFAULT 'day'
) RETURNS TABLE (
  period TEXT,
  total_amount DECIMAL,
  donation_count BIGINT,
  recurring_amount DECIMAL,
  onetime_amount DECIMAL,
  avg_points_per_dollar DECIMAL
) AS $$
DECLARE
  interval_format TEXT;
BEGIN
  -- Set date format based on interval
  CASE p_interval
    WHEN 'day' THEN interval_format := 'YYYY-MM-DD';
    WHEN 'week' THEN interval_format := 'IYYY-IW';
    WHEN 'month' THEN interval_format := 'YYYY-MM';
    ELSE interval_format := 'YYYY-MM-DD';
  END CASE;

  RETURN QUERY
  WITH donation_data AS (
    SELECT
      TO_CHAR(created_at, interval_format) AS period,
      amount,
      subscription_id IS NOT NULL AS is_recurring,
      d.id AS donation_id,
      dp.points
    FROM 
      donations d
    LEFT JOIN
      donation_points dp ON d.id = dp.donation_id
    WHERE
      status = 'completed'
      AND created_at BETWEEN p_start_date AND p_end_date
  )
  SELECT
    dd.period,
    COALESCE(SUM(dd.amount), 0) AS total_amount,
    COUNT(dd.donation_id) AS donation_count,
    COALESCE(SUM(CASE WHEN dd.is_recurring THEN dd.amount ELSE 0 END), 0) AS recurring_amount,
    COALESCE(SUM(CASE WHEN NOT dd.is_recurring THEN dd.amount ELSE 0 END), 0) AS onetime_amount,
    CASE 
      WHEN SUM(dd.amount) > 0 THEN COALESCE(SUM(dd.points), 0) / SUM(dd.amount)
      ELSE 0
    END AS avg_points_per_dollar
  FROM
    donation_data dd
  GROUP BY
    dd.period
  ORDER BY
    dd.period;
END;
$$ LANGUAGE plpgsql;

-- Function to get conversion rates for donations
CREATE OR REPLACE FUNCTION get_donation_conversion_rates(
  p_start_date TIMESTAMP DEFAULT (CURRENT_DATE - INTERVAL '30 days'),
  p_end_date TIMESTAMP DEFAULT CURRENT_DATE
) RETURNS TABLE (
  referral_source TEXT,
  page_views BIGINT,
  form_starts BIGINT,
  completions BIGINT,
  conversion_rate DECIMAL,
  avg_amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH page_view_data AS (
    SELECT
      COALESCE(referrer, 'direct') AS referral_source,
      COUNT(*) AS view_count
    FROM
      performance_metrics
    WHERE
      page_path = '/donate'
      AND event_type = 'page_view'
      AND timestamp BETWEEN p_start_date AND p_end_date
    GROUP BY
      referral_source
  ),
  form_start_data AS (
    SELECT
      COALESCE(referrer, 'direct') AS referral_source,
      COUNT(*) AS start_count
    FROM
      performance_metrics
    WHERE
      page_path = '/donate'
      AND event_type = 'form_start'
      AND timestamp BETWEEN p_start_date AND p_end_date
    GROUP BY
      referral_source
  ),
  completion_data AS (
    SELECT
      COALESCE(referral_source, 'direct') AS referral_source,
      COUNT(*) AS complete_count,
      COALESCE(AVG(amount), 0) AS average_amount
    FROM
      donations
    WHERE
      status = 'completed'
      AND created_at BETWEEN p_start_date AND p_end_date
    GROUP BY
      referral_source
  )
  SELECT
    pv.referral_source,
    pv.view_count AS page_views,
    COALESCE(fs.start_count, 0) AS form_starts,
    COALESCE(cd.complete_count, 0) AS completions,
    CASE 
      WHEN pv.view_count > 0 THEN (COALESCE(cd.complete_count, 0)::DECIMAL / pv.view_count) * 100
      ELSE 0
    END AS conversion_rate,
    COALESCE(cd.average_amount, 0) AS avg_amount
  FROM
    page_view_data pv
  LEFT JOIN
    form_start_data fs ON pv.referral_source = fs.referral_source
  LEFT JOIN
    completion_data cd ON pv.referral_source = cd.referral_source
  ORDER BY
    page_views DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get point distribution data
CREATE OR REPLACE FUNCTION get_donation_point_distribution(
  p_start_date TIMESTAMP DEFAULT (CURRENT_DATE - INTERVAL '30 days'),
  p_end_date TIMESTAMP DEFAULT CURRENT_DATE
) RETURNS TABLE (
  point_range TEXT,
  donation_count BIGINT,
  total_points BIGINT,
  avg_amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH point_data AS (
    SELECT
      dp.points,
      d.amount
    FROM
      donation_points dp
    JOIN
      donations d ON dp.donation_id = d.id
    WHERE
      d.created_at BETWEEN p_start_date AND p_end_date
      AND d.status = 'completed'
  ),
  point_ranges AS (
    SELECT
      CASE
        WHEN points < 50 THEN '0-49'
        WHEN points BETWEEN 50 AND 99 THEN '50-99'
        WHEN points BETWEEN 100 AND 249 THEN '100-249'
        WHEN points BETWEEN 250 AND 499 THEN '250-499'
        WHEN points BETWEEN 500 AND 999 THEN '500-999'
        ELSE '1000+'
      END AS point_range,
      points,
      amount
    FROM
      point_data
  )
  SELECT
    pr.point_range,
    COUNT(*) AS donation_count,
    SUM(pr.points)::BIGINT AS total_points,
    AVG(pr.amount) AS avg_amount
  FROM
    point_ranges pr
  GROUP BY
    pr.point_range
  ORDER BY
    CASE
      WHEN pr.point_range = '0-49' THEN 1
      WHEN pr.point_range = '50-99' THEN 2
      WHEN pr.point_range = '100-249' THEN 3
      WHEN pr.point_range = '250-499' THEN 4
      WHEN pr.point_range = '500-999' THEN 5
      WHEN pr.point_range = '1000+' THEN 6
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to get campaign performance metrics
CREATE OR REPLACE FUNCTION get_campaign_performance(
  p_start_date TIMESTAMP DEFAULT (CURRENT_DATE - INTERVAL '90 days'),
  p_end_date TIMESTAMP DEFAULT CURRENT_DATE
) RETURNS TABLE (
  campaign_id TEXT,
  campaign_name TEXT,
  total_donations BIGINT,
  total_amount DECIMAL,
  total_points BIGINT,
  points_per_dollar DECIMAL,
  avg_donation DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id AS campaign_id,
    dc.name AS campaign_name,
    COUNT(d.id) AS total_donations,
    COALESCE(SUM(d.amount), 0) AS total_amount,
    COALESCE(SUM(dp.points), 0)::BIGINT AS total_points,
    CASE 
      WHEN SUM(d.amount) > 0 THEN COALESCE(SUM(dp.points), 0) / SUM(d.amount)
      ELSE 0
    END AS points_per_dollar,
    COALESCE(AVG(d.amount), 0) AS avg_donation
  FROM
    donation_campaigns dc
  LEFT JOIN
    donations d ON d.campaign_id = dc.id AND d.status = 'completed' AND d.created_at BETWEEN p_start_date AND p_end_date
  LEFT JOIN
    donation_points dp ON dp.donation_id = d.id
  WHERE
    dc.created_at BETWEEN p_start_date AND p_end_date
    OR dc.is_active = true
  GROUP BY
    dc.id, dc.name
  ORDER BY
    total_amount DESC;
END;
$$ LANGUAGE plpgsql;
