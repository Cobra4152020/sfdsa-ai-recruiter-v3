-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'donation', 'badge', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create function to notify on new notification
CREATE OR REPLACE FUNCTION notify_new_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'new_notification',
    json_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'type', NEW.type,
      'title', NEW.title
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new notifications
CREATE TRIGGER trigger_notify_new_notification
AFTER INSERT ON notifications
FOR EACH ROW
EXECUTE FUNCTION notify_new_notification();

-- Create view for unread notification counts
CREATE OR REPLACE VIEW user_notification_counts AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE is_read = FALSE) AS unread_count,
  COUNT(*) AS total_count
FROM notifications
GROUP BY user_id;
