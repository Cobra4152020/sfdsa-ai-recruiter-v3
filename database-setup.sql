-- Database setup for SFDSA AI Recruiter daily briefing system
-- Run this SQL in your Supabase SQL Editor

-- Create daily_briefings table
CREATE TABLE IF NOT EXISTS daily_briefings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'General',
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create briefing_attendance table for tracking attendance
CREATE TABLE IF NOT EXISTS briefing_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  briefing_id UUID REFERENCES daily_briefings(id) ON DELETE CASCADE,
  attended_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, briefing_id)
);

-- Create briefing_shares table for tracking social media shares
CREATE TABLE IF NOT EXISTS briefing_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  briefing_id UUID REFERENCES daily_briefings(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, briefing_id, platform)
);

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  participation_count INTEGER DEFAULT 0,
  has_applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample daily briefings (365 briefings for a full year cycle)
INSERT INTO daily_briefings (title, content, theme, date) VALUES 
(
  'San Francisco Deputy Sheriff''s Daily Briefing - Week 1 Day 1',
  '<h3>Welcome to Your Law Enforcement Journey</h3>
   <p>Today marks the beginning of your commitment to serving the San Francisco community. As a Deputy Sheriff, you represent justice, integrity, and protection for all citizens.</p>
   
   <h4>Today''s Focus Areas:</h4>
   <ul>
     <li>Equipment inspection and maintenance protocols</li>
     <li>Community engagement strategies</li>
     <li>Safety procedures and situational awareness</li>
     <li>Report writing standards and documentation</li>
   </ul>
   
   <h4>Key Reminders:</h4>
   <p>Always maintain professionalism in all interactions. Your conduct reflects not only on yourself but on the entire San Francisco Deputy Sheriff''s Department. Remember: we serve with honor, integrity, and dedication.</p>
   
   <h4>Today''s Quote:</h4>
   <blockquote>"The strength of a community lies in the hands of those who protect it."</blockquote>',
  'Orientation',
  '2024-01-01'
),
(
  'Daily Operations and Community Safety',
  '<h3>Building Trust Through Service</h3>
   <p>Community policing is the foundation of effective law enforcement. Every interaction is an opportunity to build trust and demonstrate our commitment to public safety.</p>
   
   <h4>Focus Areas:</h4>
   <ul>
     <li>Active listening during citizen interactions</li>
     <li>De-escalation techniques in tense situations</li>
     <li>Proper use of communication equipment</li>
     <li>Emergency response protocols</li>
   </ul>
   
   <h4>Safety Checkpoint:</h4>
   <p>Before starting your shift, ensure all equipment is functioning properly. Check your radio, body armor, and emergency supplies. Your safety enables you to protect others.</p>',
  'Community Safety',
  '2024-01-02'
),
(
  'Emergency Response and Crisis Management',
  '<h3>Preparedness in Critical Situations</h3>
   <p>Emergency situations require quick thinking, clear communication, and coordinated response. Today we focus on crisis management protocols and emergency preparedness.</p>
   
   <h4>Emergency Response Priorities:</h4>
   <ul>
     <li>Scene safety assessment and establishment</li>
     <li>Clear and concise radio communication</li>
     <li>Coordination with other emergency services</li>
     <li>Evidence preservation and witness management</li>
   </ul>
   
   <h4>Remember:</h4>
   <p>In crisis situations, your training takes over. Trust your preparation, communicate clearly, and prioritize public safety above all else.</p>',
  'Emergency Response',
  '2024-01-03'
),
(
  'Legal Updates and Procedural Guidelines',
  '<h3>Staying Current with Legal Standards</h3>
   <p>Laws and procedures evolve to better serve justice and protect rights. Staying informed about legal updates ensures our actions are always within proper guidelines.</p>
   
   <h4>Recent Updates:</h4>
   <ul>
     <li>Updated search and seizure procedures</li>
     <li>New evidence handling protocols</li>
     <li>Revised use of force policies</li>
     <li>Community relations guidelines</li>
   </ul>
   
   <h4>Legal Reminder:</h4>
   <p>When in doubt about any legal procedure, consult with your supervisor or the department''s legal counsel. It''s better to seek clarification than to proceed incorrectly.</p>',
  'Legal Updates',
  '2024-01-04'
),
(
  'Mental Health and Wellness',
  '<h3>Taking Care of Those Who Serve</h3>
   <p>Law enforcement can be mentally and emotionally demanding. Your well-being is crucial not only for your personal health but for your effectiveness in serving the community.</p>
   
   <h4>Wellness Strategies:</h4>
   <ul>
     <li>Regular physical exercise and fitness</li>
     <li>Stress management techniques</li>
     <li>Work-life balance maintenance</li>
     <li>Seeking support when needed</li>
   </ul>
   
   <h4>Resources Available:</h4>
   <p>The department provides counseling services, fitness facilities, and peer support programs. Remember, seeking help is a sign of strength, not weakness.</p>',
  'Wellness',
  '2024-01-05'
),
(
  'Training and Professional Development',
  '<h3>Continuous Learning for Excellence</h3>
   <p>The field of law enforcement constantly evolves. Ongoing training ensures we maintain the highest standards of professionalism and effectiveness.</p>
   
   <h4>Training Opportunities:</h4>
   <ul>
     <li>Advanced tactical training sessions</li>
     <li>Communication and de-escalation workshops</li>
     <li>Technology and equipment updates</li>
     <li>Leadership development programs</li>
   </ul>
   
   <h4>Professional Growth:</h4>
   <p>Take advantage of every training opportunity. Each session makes you a better officer and better serves our community''s needs.</p>',
  'Training',
  '2024-01-06'
),
(
  'Weekend Safety and Community Engagement',
  '<h3>Weekend Patrol Excellence</h3>
   <p>Weekends often bring increased activity and unique challenges. Maintaining vigilance while engaging positively with the community is essential.</p>
   
   <h4>Weekend Focus:</h4>
   <ul>
     <li>Increased foot patrol in high-traffic areas</li>
     <li>Community event security and support</li>
     <li>Traffic safety and enforcement</li>
     <li>Proactive crime prevention measures</li>
   </ul>
   
   <h4>Community Connection:</h4>
   <p>Weekends provide excellent opportunities for positive community interactions. Take time to engage with families, business owners, and community groups.</p>',
  'Community Engagement',
  '2024-01-07'
);

-- Insert additional briefings to reach 365 total (abbreviated for brevity)
-- You can add more briefings following the same pattern

-- Create RPC function for leaderboard
CREATE OR REPLACE FUNCTION get_briefing_leaderboard()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  attendance_count BIGINT,
  share_count BIGINT,
  total_points BIGINT
) 
LANGUAGE SQL
AS $$
  SELECT 
    u.id as user_id,
    u.name as username,
    u.avatar_url,
    COALESCE(a.attendance_count, 0) as attendance_count,
    COALESCE(s.share_count, 0) as share_count,
    (COALESCE(a.attendance_count, 0) * 5 + COALESCE(s.share_count, 0) * 10) as total_points
  FROM users u
  LEFT JOIN (
    SELECT user_id, COUNT(*) as attendance_count
    FROM briefing_attendance
    GROUP BY user_id
  ) a ON u.id = a.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as share_count
    FROM briefing_shares
    GROUP BY user_id
  ) s ON u.id = s.user_id
  WHERE u.participation_count > 0 OR a.attendance_count > 0 OR s.share_count > 0
  ORDER BY total_points DESC
  LIMIT 10;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_briefings_date ON daily_briefings(date);
CREATE INDEX IF NOT EXISTS idx_briefing_attendance_user_id ON briefing_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_briefing_attendance_briefing_id ON briefing_attendance(briefing_id);
CREATE INDEX IF NOT EXISTS idx_briefing_shares_user_id ON briefing_shares(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefing_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefing_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Daily briefings are readable by everyone
CREATE POLICY "Daily briefings are viewable by everyone" ON daily_briefings
  FOR SELECT USING (true);

-- Users can only see their own attendance records
CREATE POLICY "Users can view own attendance" ON briefing_attendance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance" ON briefing_attendance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own share records  
CREATE POLICY "Users can view own shares" ON briefing_shares
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shares" ON briefing_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view all user profiles but only update their own
CREATE POLICY "User profiles are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT ON daily_briefings TO authenticated, anon;
GRANT ALL ON briefing_attendance TO authenticated;
GRANT ALL ON briefing_shares TO authenticated;
GRANT ALL ON users TO authenticated;

-- Insert a few more sample briefings for immediate testing
INSERT INTO daily_briefings (title, content, theme, date) VALUES 
(
  'Today''s Safety Focus',
  '<h3>Officer Safety and Situational Awareness</h3>
   <p>Today we emphasize the critical importance of officer safety and maintaining constant situational awareness during all interactions.</p>
   
   <h4>Key Safety Points:</h4>
   <ul>
     <li>Always position yourself tactically during stops</li>
     <li>Maintain clear communication with dispatch</li>
     <li>Trust your instincts and training</li>
     <li>Request backup when necessary</li>
   </ul>',
  'Safety',
  CURRENT_DATE
),
(
  'Community Partnership Building',
  '<h3>Strengthening Community Bonds</h3>
   <p>Building strong relationships with community members is fundamental to effective policing and public safety.</p>
   
   <h4>Partnership Strategies:</h4>
   <ul>
     <li>Participate in community events</li>
     <li>Listen actively to community concerns</li>
     <li>Follow up on reported issues</li>
     <li>Maintain professional and respectful demeanor</li>
   </ul>',
  'Community Relations',
  CURRENT_DATE + INTERVAL '1 day'
);

COMMENT ON TABLE daily_briefings IS 'Stores daily briefing content for San Francisco Deputy Sheriff Department';
COMMENT ON TABLE briefing_attendance IS 'Tracks user attendance at daily briefings';
COMMENT ON TABLE briefing_shares IS 'Tracks social media shares of daily briefings';
COMMENT ON FUNCTION get_briefing_leaderboard() IS 'Returns leaderboard of users based on briefing participation'; 