-- Function to get donation statistics
CREATE OR REPLACE FUNCTION get_donation_stats()
RETURNS TABLE (
  total_amount DECIMAL,
  total_count BIGINT,
  month_amount DECIMAL,
  month_count BIGINT,
  recurring_amount DECIMAL,
  recurring_count BIGINT
) AS $$
DECLARE
  first_day_of_month TIMESTAMP;
BEGIN
  -- Calculate first day of current month
  first_day_of_month := date_trunc('month', CURRENT_DATE);
  
  -- Get total donations
  SELECT 
    COALESCE(SUM(amount), 0),
    COUNT(*)
  INTO 
    total_amount,
    total_count
  FROM 
    donations
  WHERE 
    status = 'completed';
  
  -- Get this month's donations
  SELECT 
    COALESCE(SUM(amount), 0),
    COUNT(*)
  INTO 
    month_amount,
    month_count
  FROM 
    donations
  WHERE 
    status = 'completed'
    AND created_at >= first_day_of_month;
  
  -- Get recurring donations
  SELECT 
    COALESCE(SUM(amount), 0),
    COUNT(*)
  INTO 
    recurring_amount,
    recurring_count
  FROM 
    subscriptions
  WHERE 
    status = 'active';
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
