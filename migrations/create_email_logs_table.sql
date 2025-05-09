-- Create email_logs table to track sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT,
  status TEXT,
  tracking_number TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivery_status TEXT DEFAULT 'sent',
  error_message TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
