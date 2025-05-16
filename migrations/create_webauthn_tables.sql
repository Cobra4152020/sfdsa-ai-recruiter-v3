-- Create WebAuthn tables
CREATE TABLE IF NOT EXISTS public.webauthn_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes')
);

CREATE TABLE IF NOT EXISTS public.user_authenticators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credential_id TEXT NOT NULL UNIQUE,
    credential_public_key BYTEA NOT NULL,
    counter BIGINT NOT NULL DEFAULT 0,
    credential_device_type TEXT,
    credential_backed_up BOOLEAN,
    transports TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_user_id ON public.webauthn_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_expires_at ON public.webauthn_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_authenticators_user_id ON public.user_authenticators(user_id);
CREATE INDEX IF NOT EXISTS idx_user_authenticators_credential_id ON public.user_authenticators(credential_id);

-- Enable RLS
ALTER TABLE public.webauthn_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_authenticators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY webauthn_challenges_policy ON public.webauthn_challenges
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id = auth.uid()
    );

CREATE POLICY user_authenticators_policy ON public.user_authenticators
    USING (
        auth.uid()::text IN (SELECT id::text FROM public.admins)
        OR user_id = auth.uid()
    );

-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_challenges()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM webauthn_challenges
    WHERE expires_at < NOW();
END;
$$;

-- Create scheduled job if pg_cron is available
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        PERFORM cron.schedule('0 * * * *', 'SELECT cleanup_expired_challenges()');
    END;
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'pg_cron extension not available, skipping scheduled cleanup job';
END;
$$; 