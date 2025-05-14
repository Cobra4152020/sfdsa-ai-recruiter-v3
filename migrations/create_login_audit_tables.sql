-- Create login audit log table
CREATE TABLE IF NOT EXISTS login_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  event_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create login errors table
CREATE TABLE IF NOT EXISTS login_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  email TEXT,
  error_type TEXT NOT NULL,
  error_message TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create login metrics table
CREATE TABLE IF NOT EXISTS login_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_role TEXT NOT NULL,
  login_method TEXT NOT NULL, -- password, social, magic_link
  success BOOLEAN NOT NULL,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on login_audit_logs
CREATE INDEX IF NOT EXISTS idx_login_audit_logs_user_id ON login_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_audit_logs_event_type ON login_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_login_audit_logs_created_at ON login_audit_logs(created_at);

-- Create index on login_errors
CREATE INDEX IF NOT EXISTS idx_login_errors_user_id ON login_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_login_errors_email ON login_errors(email);
CREATE INDEX IF NOT EXISTS idx_login_errors_error_type ON login_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_login_errors_created_at ON login_errors(created_at);

-- Create index on login_metrics
CREATE INDEX IF NOT EXISTS idx_login_metrics_user_role ON login_metrics(user_role);
CREATE INDEX IF NOT EXISTS idx_login_metrics_login_method ON login_metrics(login_method);
CREATE INDEX IF NOT EXISTS idx_login_metrics_created_at ON login_metrics(created_at);
