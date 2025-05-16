-- Create WebAuthn tables if they don't exist
CREATE TABLE IF NOT EXISTS public.webauthn_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.user_authenticators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credential_id TEXT NOT NULL UNIQUE,
    credential_public_key TEXT NOT NULL,
    counter BIGINT NOT NULL DEFAULT 0,
    transports TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_user_id ON public.webauthn_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_expires_at ON public.webauthn_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_authenticators_user_id ON public.user_authenticators(user_id);
CREATE INDEX IF NOT EXISTS idx_user_authenticators_credential_id ON public.user_authenticators(credential_id);

-- Enable RLS
ALTER TABLE public.webauthn_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_authenticators ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS webauthn_challenges_policy ON public.webauthn_challenges;
DROP POLICY IF EXISTS user_authenticators_policy ON public.user_authenticators;

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
AS $cleanup_challenges$
BEGIN
    DELETE FROM webauthn_challenges
    WHERE expires_at < NOW();
END;
$cleanup_challenges$ LANGUAGE plpgsql;

-- Create scheduled job if pg_cron is available
DO $do$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        PERFORM cron.schedule('0 * * * *', 'SELECT cleanup_expired_challenges()');
    ELSE
        RAISE NOTICE 'pg_cron extension not available, skipping scheduled cleanup job';
    END IF;
END;
$do$ LANGUAGE plpgsql; 