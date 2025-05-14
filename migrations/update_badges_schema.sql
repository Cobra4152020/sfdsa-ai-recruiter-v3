-- Add requirements column to badges table if it doesn't exist
ALTER TABLE badges ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb;

-- Add progress tracking table
CREATE TABLE IF NOT EXISTS badge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  actions_completed JSONB DEFAULT '[]'::jsonb,
  last_action_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Add badge sharing activity table
CREATE TABLE IF NOT EXISTS badge_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  share_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_badge_progress_user_id ON badge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_progress_badge_id ON badge_progress(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_shares_user_id ON badge_shares(user_id);
