-- Create security monitoring tables
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('login_attempt', 'api_access', 'admin_action', 'data_modification')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.security_events(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    metadata JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.blocked_ips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    blocked_until TIMESTAMPTZ,
    blocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.monitored_ips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    monitoring_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    monitoring_level TEXT NOT NULL CHECK (monitoring_level IN ('low', 'medium', 'high')),
    added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.security_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES public.security_alerts(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.security_review_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES public.security_alerts(id) ON DELETE CASCADE,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON public.security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON public.security_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_security_alerts_event_id ON public.security_alerts(event_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON public.security_alerts(type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_timestamp ON public.security_alerts(timestamp);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON public.blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_blocked_until ON public.blocked_ips(blocked_until);

CREATE INDEX IF NOT EXISTS idx_monitored_ips_ip_address ON public.monitored_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_monitored_ips_monitoring_level ON public.monitored_ips(monitoring_level);

CREATE INDEX IF NOT EXISTS idx_security_notifications_alert_id ON public.security_notifications(alert_id);
CREATE INDEX IF NOT EXISTS idx_security_notifications_severity ON public.security_notifications(severity);
CREATE INDEX IF NOT EXISTS idx_security_notifications_created_at ON public.security_notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_security_review_queue_alert_id ON public.security_review_queue(alert_id);
CREATE INDEX IF NOT EXISTS idx_security_review_queue_priority ON public.security_review_queue(priority);
CREATE INDEX IF NOT EXISTS idx_security_review_queue_status ON public.security_review_queue(status);
CREATE INDEX IF NOT EXISTS idx_security_review_queue_assigned_to ON public.security_review_queue(assigned_to);

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitored_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_review_queue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY security_events_policy ON public.security_events
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY security_alerts_policy ON public.security_alerts
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY blocked_ips_policy ON public.blocked_ips
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY monitored_ips_policy ON public.monitored_ips
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY security_notifications_policy ON public.security_notifications
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

CREATE POLICY security_review_queue_policy ON public.security_review_queue
    USING (auth.uid()::text IN (SELECT id::text FROM public.admins));

-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_security_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Delete security events older than 90 days
    DELETE FROM security_events
    WHERE timestamp < NOW() - INTERVAL '90 days';

    -- Delete resolved alerts older than 30 days
    DELETE FROM security_alerts
    WHERE resolved_at IS NOT NULL
    AND resolved_at < NOW() - INTERVAL '30 days';

    -- Delete acknowledged notifications older than 30 days
    DELETE FROM security_notifications
    WHERE acknowledged_at IS NOT NULL
    AND acknowledged_at < NOW() - INTERVAL '30 days';

    -- Delete resolved review items older than 30 days
    DELETE FROM security_review_queue
    WHERE resolved_at IS NOT NULL
    AND resolved_at < NOW() - INTERVAL '30 days';
END;
$$;

-- Create scheduled job if pg_cron is available
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        PERFORM cron.schedule('0 0 * * *', 'SELECT cleanup_old_security_data()');
    END;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'pg_cron extension not available, skipping scheduled cleanup job';
END;
$$; 