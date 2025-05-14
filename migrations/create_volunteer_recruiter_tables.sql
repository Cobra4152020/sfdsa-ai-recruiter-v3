-- Create volunteer recruiter stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS volunteer_recruiter_stats (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referrals_count INTEGER DEFAULT 0,
  successful_referrals INTEGER DEFAULT 0,
  events_participated INTEGER DEFAULT 0,
  events_organized INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create volunteer recruiter referrals table
CREATE TABLE IF NOT EXISTS volunteer_referrals (
  id SERIAL PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_email VARCHAR(255) NOT NULL,
  referral_name VARCHAR(255),
  referral_phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create volunteer recruiter events table
CREATE TABLE IF NOT EXISTS volunteer_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create volunteer event participants table
CREATE TABLE IF NOT EXISTS volunteer_event_participants (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES volunteer_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_volunteer_recruiter_stats_updated_at
BEFORE UPDATE ON volunteer_recruiter_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteer_referrals_updated_at
BEFORE UPDATE ON volunteer_referrals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteer_events_updated_at
BEFORE UPDATE ON volunteer_events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add volunteer_recruiter role if it doesn't exist in the roles table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'user', 'volunteer_recruiter');
  ELSE
    -- Check if volunteer_recruiter exists in the enum
    IF NOT EXISTS (
      SELECT 1
      FROM pg_enum
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
      AND enumlabel = 'volunteer_recruiter'
    ) THEN
      -- Add volunteer_recruiter to the enum
      ALTER TYPE user_role ADD VALUE 'volunteer_recruiter';
    END IF;
  END IF;
END$$;

-- Add is_volunteer_recruiter column to user_profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_volunteer_recruiter'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_volunteer_recruiter BOOLEAN DEFAULT FALSE;
  END IF;
END$$;

-- Add organization, position, and location columns to user_profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'organization'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN organization VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'position'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN position VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN location VARCHAR(255);
  END IF;
END$$;
