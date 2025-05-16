-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('login_attempt', 'api_access', 'admin_action', 'data_modification')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create security alerts table
CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES security_events(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT
);

-- Create blocked IPs table
CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  reason TEXT NOT NULL,
  blocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  unblocked_at TIMESTAMP WITH TIME ZONE,
  unblocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create monitored IPs table
CREATE TABLE IF NOT EXISTS monitored_ips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  monitoring_level TEXT NOT NULL CHECK (monitoring_level IN ('low', 'medium', 'high')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create security notifications table
CREATE TABLE IF NOT EXISTS security_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID NOT NULL REFERENCES security_alerts(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create security review queue table
CREATE TABLE IF NOT EXISTS security_review_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID NOT NULL REFERENCES security_alerts(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'reviewed', 'escalated'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(type);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);

CREATE INDEX IF NOT EXISTS idx_security_alerts_timestamp ON security_alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved ON security_alerts(resolved);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_blocked_at ON blocked_ips(blocked_at);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_expires_at ON blocked_ips(expires_at);

CREATE INDEX IF NOT EXISTS idx_monitored_ips_ip_address ON monitored_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_monitored_ips_monitoring_level ON monitored_ips(monitoring_level);
CREATE INDEX IF NOT EXISTS idx_monitored_ips_started_at ON monitored_ips(started_at);

CREATE INDEX IF NOT EXISTS idx_security_notifications_created_at ON security_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_security_notifications_severity ON security_notifications(severity);
CREATE INDEX IF NOT EXISTS idx_security_notifications_alert_id ON security_notifications(alert_id);

CREATE INDEX IF NOT EXISTS idx_security_review_queue_created_at ON security_review_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_security_review_queue_severity ON security_review_queue(severity);
CREATE INDEX IF NOT EXISTS idx_security_review_queue_status ON security_review_queue(status);

-- Enable Row Level Security
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_review_queue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Security events are viewable by admins only"
  ON security_events FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Security alerts are viewable by admins only"
  ON security_alerts FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Blocked IPs are viewable by admins only"
  ON blocked_ips FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Monitored IPs are viewable by admins only"
  ON monitored_ips FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Security notifications are viewable by admins only"
  ON security_notifications FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Security review queue is viewable by admins only"
  ON security_review_queue FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to clean up old security events
CREATE OR REPLACE FUNCTION cleanup_old_security_data()
RETURNS void AS $$
BEGIN
  -- Delete security events older than 90 days
  DELETE FROM security_events
  WHERE timestamp < NOW() - INTERVAL '90 days';

  -- Delete resolved alerts older than 90 days
  DELETE FROM security_alerts
  WHERE resolved = true
    AND resolved_at < NOW() - INTERVAL '90 days';

  -- Delete expired IP blocks
  DELETE FROM blocked_ips
  WHERE expires_at < NOW();

  -- Delete old notifications that have been acknowledged
  DELETE FROM security_notifications
  WHERE acknowledged_at < NOW() - INTERVAL '90 days';

  -- Delete old reviewed items from the queue
  DELETE FROM security_review_queue
  WHERE status = 'reviewed'
    AND reviewed_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up old data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    PERFORM cron.schedule('0 0 * * *', 'SELECT cleanup_old_security_data()');
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron extension not available, skipping scheduled cleanup job';
END $$; 