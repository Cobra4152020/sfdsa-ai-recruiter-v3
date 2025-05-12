-- Create daily_briefings table
CREATE TABLE IF NOT EXISTS daily_briefings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  theme VARCHAR(50) NOT NULL, -- duty, courage, respect, service, leadership, resilience
  quote TEXT NOT NULL,
  quote_author VARCHAR(255),
  sgt_ken_take TEXT NOT NULL,
  call_to_action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

-- Create briefing_attendance table to track who viewed the briefing
CREATE TABLE IF NOT EXISTS briefing_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  briefing_id UUID REFERENCES daily_briefings(id) ON DELETE CASCADE,
  attended_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  points_awarded INTEGER DEFAULT 0,
  UNIQUE(user_id, briefing_id)
);

-- Create briefing_shares table to track social media shares
CREATE TABLE IF NOT EXISTS briefing_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  briefing_id UUID REFERENCES daily_briefings(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- twitter, facebook, linkedin, etc.
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  points_awarded INTEGER DEFAULT 0
);

-- Create table for briefing streaks (consecutive days viewed)
CREATE TABLE IF NOT EXISTS briefing_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_briefing_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial sample briefings
INSERT INTO daily_briefings (date, theme, quote, quote_author, sgt_ken_take, call_to_action)
VALUES
(CURRENT_DATE, 'duty', 'The only easy day was yesterday.', 'Navy SEALs', 
 'In this job, yesterday's victories don't protect today's streets. Every shift is a new test of your commitment. Show up ready.', 
 'Ready to prove yourself daily? Join the Sheriff''s Department where every day matters.'),

(CURRENT_DATE - INTERVAL '1 day', 'courage', 'Courage is not the absence of fear, but the triumph over it.', 'Nelson Mandela', 
 'Fear's natural on this job. Every dark alley, every domestic call, every traffic stop. What separates a civilian from a deputy? You walk in anyway.', 
 'We need deputies who face what others run from. Apply today if that's you.'),

(CURRENT_DATE - INTERVAL '2 days', 'respect', 'Respect is how you treat everyone, not just those you want to impress.', 'Richard Branson', 
 'The badge doesn't earn respect automatically. It's earned in how you talk to that homeless person as respectfully as you would the mayor. Everyone deserves your best.', 
 'If you believe in treating everyone with dignity, we need you wearing this badge.'),

(CURRENT_DATE - INTERVAL '3 days', 'service', 'The best way to find yourself is to lose yourself in the service of others.', 'Mahatma Gandhi', 
 'This county doesn't need heroes. It needs servants. People who show up day after day putting others' needs before their ego. That's what this badge means.', 
 'Service isn't glamorous, but it changes lives. Ready to make that impact? Join us.'),

(CURRENT_DATE - INTERVAL '4 days', 'leadership', 'A leader is one who knows the way, goes the way, and shows the way.', 'John C. Maxwell', 
 'Leadership in this department isn't about rank. It's about the rookie who speaks up when protocols aren't followed, even to veterans. That takes guts.', 
 'We're looking for natural leaders to wear the badge. If that's you, step up now.'),

(CURRENT_DATE - INTERVAL '5 days', 'resilience', 'The oak fought the wind and was broken, the willow bent when it must and survived.', 'Robert Jordan', 
 'In this field, you'll see things that test your limits. The deputies who last aren't the toughest—they're the ones who know when to bend without breaking.', 
 'Resilience isn't just surviving the job—it's thriving in it. Join a team that builds you up when the job gets tough.');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_briefing_attendance_user_id ON briefing_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_briefing_attendance_briefing_id ON briefing_attendance(briefing_id);
CREATE INDEX IF NOT EXISTS idx_briefing_shares_user_id ON briefing_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_briefing_shares_briefing_id ON briefing_shares(briefing_id);
