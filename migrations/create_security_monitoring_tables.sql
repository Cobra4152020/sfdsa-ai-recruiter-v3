-- Create security monitoring tables
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    source_ip INET,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.security_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    source_ip INET,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.blocked_ips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address INET NOT NULL UNIQUE,
    reason TEXT,
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.monitored_ips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address INET NOT NULL UNIQUE,
    reason TEXT,
    risk_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.security_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.security_review_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_type VARCHAR(50) NOT NULL,
    item_id UUID NOT NULL,
    priority INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON public.security_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);

CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON public.security_alerts(status);
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON public.security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON public.security_alerts(user_id);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON public.blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_blocked_until ON public.blocked_ips(blocked_until);

CREATE INDEX IF NOT EXISTS idx_monitored_ips_ip ON public.monitored_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_monitored_ips_risk ON public.monitored_ips(risk_level);

CREATE INDEX IF NOT EXISTS idx_security_notifications_user ON public.security_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_security_notifications_read ON public.security_notifications(read);

CREATE INDEX IF NOT EXISTS idx_security_review_queue_status ON public.security_review_queue(status);
CREATE INDEX IF NOT EXISTS idx_security_review_queue_priority ON public.security_review_queue(priority);
CREATE INDEX IF NOT EXISTS idx_security_review_queue_assigned ON public.security_review_queue(assigned_to);

-- Enable RLS
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitored_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_review_queue ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS security_events_policy ON public.security_events;
DROP POLICY IF EXISTS security_alerts_policy ON public.security_alerts;
DROP POLICY IF EXISTS blocked_ips_policy ON public.blocked_ips;
DROP POLICY IF EXISTS monitored_ips_policy ON public.monitored_ips;
DROP POLICY IF EXISTS security_notifications_policy ON public.security_notifications;
DROP POLICY IF EXISTS security_review_queue_policy ON public.security_review_queue;

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
AS $cleanup_security$
BEGIN
    -- Delete security events older than 90 days
    DELETE FROM security_events
    WHERE timestamp < NOW() - INTERVAL '90 days';

    -- Delete resolved review items older than 30 days
    DELETE FROM security_review_queue
    WHERE resolved_at IS NOT NULL
    AND resolved_at < NOW() - INTERVAL '30 days';
END;
$cleanup_security$ LANGUAGE plpgsql;

-- Create scheduled job if pg_cron is available
DO $do$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        PERFORM cron.schedule('0 0 * * *', 'SELECT cleanup_old_security_data()');
    ELSE
        RAISE NOTICE 'pg_cron extension not available, skipping scheduled cleanup job';
    END IF;
END;
$do$ LANGUAGE plpgsql; 