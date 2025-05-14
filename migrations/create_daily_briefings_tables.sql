-- Create daily_briefings table
CREATE TABLE IF NOT EXISTS daily_briefings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  theme TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create briefing_attendance table
CREATE TABLE IF NOT EXISTS briefing_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  briefing_id UUID NOT NULL REFERENCES daily_briefings(id) ON DELETE CASCADE,
  attended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, briefing_id)
);

-- Create briefing_shares table
CREATE TABLE IF NOT EXISTS briefing_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  briefing_id UUID NOT NULL REFERENCES daily_briefings(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, briefing_id, platform)
);

-- Create function to get briefing leaderboard
CREATE OR REPLACE FUNCTION get_briefing_leaderboard()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  attendance_count BIGINT,
  share_count BIGINT,
  total_points BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH attendance_counts AS (
    SELECT 
      ba.user_id,
      COUNT(*) AS count
    FROM 
      briefing_attendance ba
    GROUP BY 
      ba.user_id
  ),
  share_counts AS (
    SELECT 
      bs.user_id,
      COUNT(*) AS count
    FROM 
      briefing_shares bs
    GROUP BY 
      bs.user_id
  ),
  points AS (
    SELECT 
      pp.user_id,
      SUM(pp.points) AS total
    FROM 
      participation_points pp
    WHERE 
      pp.activity_type IN ('daily_briefing_attendance', 'daily_briefing_share')
    GROUP BY 
      pp.user_id
  )
  SELECT 
    u.id AS user_id,
    u.username,
    u.avatar_url,
    COALESCE(ac.count, 0) AS attendance_count,
    COALESCE(sc.count, 0) AS share_count,
    COALESCE(p.total, 0) AS total_points
  FROM 
    users u
  LEFT JOIN 
    attendance_counts ac ON u.id = ac.user_id
  LEFT JOIN 
    share_counts sc ON u.id = sc.user_id
  LEFT JOIN 
    points p ON u.id = p.user_id
  WHERE 
    COALESCE(ac.count, 0) > 0 OR COALESCE(sc.count, 0) > 0
  ORDER BY 
    total_points DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample daily briefings for the next 7 days
INSERT INTO daily_briefings (title, content, theme, date)
VALUES
  (
    'The Power of Discipline',
    'Good morning, recruits! Sgt. Ken here with your daily briefing.\n\nToday we''re talking about DISCIPLINE. In law enforcement, discipline isn''t just about following rules—it''s about building the mental fortitude that will carry you through the toughest situations.\n\nDiscipline means showing up every day, even when motivation is low. It means maintaining your composure when others are losing theirs. It means doing the right thing, even when no one is watching.\n\nAs Deputy Sheriffs, we''re held to a higher standard. The discipline you develop now during recruitment will serve as your foundation throughout your career.\n\nYour challenge today: Identify one area where you can improve your discipline. Maybe it''s your physical training, your study habits, or your sleep schedule. Make a concrete plan to strengthen that area.\n\nRemember, discipline is like a muscle—it grows stronger with consistent use.\n\nStay focused, stay disciplined, and I''ll see you tomorrow for another briefing.',
    'Discipline',
    CURRENT_DATE
  ),
  (
    'Community Connection',
    'Good morning, recruits! Sgt. Ken checking in.\n\nToday''s briefing focuses on COMMUNITY CONNECTION. As Deputy Sheriffs, we don''t just enforce laws—we serve the diverse communities of San Francisco.\n\nBuilding trust with the community isn''t optional—it''s essential to effective law enforcement. When citizens trust us, they''re more likely to report crimes, provide information, and work with us to keep neighborhoods safe.\n\nSan Francisco is home to people from all walks of life, with different backgrounds, beliefs, and experiences. Understanding these differences makes us better at our jobs.\n\nYour challenge today: Learn something new about a community in San Francisco that you''re less familiar with. It could be a cultural tradition, a neighborhood''s history, or a current community issue.\n\nRemember, every positive interaction you have with a community member helps build the bridge of trust that makes our city safer for everyone.\n\nStay connected, stay compassionate, and I''ll see you tomorrow for another briefing.',
    'Community',
    CURRENT_DATE + INTERVAL '1 day'
  ),
  (
    'Mental Resilience',
    'Good morning, recruits! Sgt. Ken here with an important message.\n\nToday we''re focusing on MENTAL RESILIENCE. Law enforcement is as mentally demanding as it is physically challenging.\n\nYou''ll face situations that test your emotional strength—from tense confrontations to witnessing trauma. Building mental resilience now will help you navigate these challenges while maintaining your well-being.\n\nMental resilience isn''t about suppressing emotions—it''s about processing them effectively. It''s about bouncing back from setbacks and learning from difficult experiences.\n\nYour challenge today: Practice a stress-management technique. This could be meditation, deep breathing, journaling, or talking with a trusted friend. Find what works for you and make it part of your routine.\n\nRemember, seeking support when you need it isn''t a sign of weakness—it''s a sign of strength and self-awareness.\n\nStay resilient, stay balanced, and I''ll see you tomorrow for another briefing.',
    'Mental Health',
    CURRENT_DATE + INTERVAL '2 days'
  ),
  (
    'Tactical Communication',
    'Good morning, recruits! Sgt. Ken checking in.\n\nToday''s briefing is on TACTICAL COMMUNICATION. Your ability to communicate effectively can be your most powerful tool in the field.\n\nTactical communication is about using your words to de-escalate situations, gather information, and gain compliance without resorting to force. It''s about listening as much as speaking.\n\nThe right words at the right time can prevent a situation from escalating. They can help a distressed person calm down. They can help you connect with someone in crisis.\n\nYour challenge today: Practice active listening in your conversations. Focus completely on the speaker, acknowledge what they''re saying, and ask clarifying questions before responding.\n\nRemember, communication is a skill that improves with practice. The more you work on it now, the more effective you''ll be when it matters most.\n\nStay articulate, stay attentive, and I''ll see you tomorrow for another briefing.',
    'Communication',
    CURRENT_DATE + INTERVAL '3 days'
  ),
  (
    'Physical Readiness',
    'Good morning, recruits! Sgt. Ken here with your daily motivation.\n\nToday we''re focusing on PHYSICAL READINESS. The physical demands of being a Deputy Sheriff are significant, and your fitness level can make the difference in critical situations.\n\nPhysical readiness isn''t just about passing the entrance fitness test—it''s about developing the stamina, strength, and agility you''ll need throughout your career. It''s about being prepared for the unexpected.\n\nRegular physical training also improves your mental sharpness, reduces stress, and contributes to your overall well-being.\n\nYour challenge today: Add one new element to your fitness routine. If you''ve been focusing on cardio, add some strength training. If you''ve been lifting weights, add some flexibility exercises.\n\nRemember, consistency is key. Small improvements over time lead to significant results.\n\nStay active, stay strong, and I''ll see you tomorrow for another briefing.',
    'Fitness',
    CURRENT_DATE + INTERVAL '4 days'
  ),
  (
    'Legal Knowledge',
    'Good morning, recruits! Sgt. Ken here with an essential briefing.\n\nToday we''re focusing on LEGAL KNOWLEDGE. As Deputy Sheriffs, we must understand the laws we enforce and the legal boundaries of our authority.\n\nA solid grasp of criminal law, constitutional rights, and departmental policies is fundamental to performing your duties effectively and ethically. It protects both the public and yourself.\n\nLegal knowledge isn''t static—laws change, court decisions evolve, and policies are updated. Continuous learning is part of the job.\n\nYour challenge today: Research a recent court decision that affects law enforcement procedures. Understand how it might impact your future work.\n\nRemember, when you know the law thoroughly, you can enforce it confidently and fairly.\n\nStay informed, stay prepared, and I''ll see you tomorrow for another briefing.',
    'Legal',
    CURRENT_DATE + INTERVAL '5 days'
  ),
  (
    'Team Cohesion',
    'Good morning, recruits! Sgt. Ken checking in.\n\nToday''s briefing is about TEAM COHESION. In law enforcement, we rely on each other every day—sometimes in life-or-death situations.\n\nStrong teams are built on trust, communication, and mutual respect. They''re formed through shared experiences, honest feedback, and a commitment to supporting each other.\n\nAs a Deputy Sheriff, you''ll be part of a team that depends on each member doing their part. Your reliability, your skills, and your attitude will matter to everyone around you.\n\nYour challenge today: Reflect on your strengths and weaknesses as a team member. How can you contribute more effectively to the teams you''re part of?\n\nRemember, the strongest chain is only as strong as its weakest link. We all have a responsibility to be the strongest link we can be.\n\nStay united, stay supportive, and I''ll see you tomorrow for another briefing.',
    'Teamwork',
    CURRENT_DATE + INTERVAL '6 days'
  );

-- Create index on briefing_attendance for faster queries
CREATE INDEX IF NOT EXISTS idx_briefing_attendance_user_id ON briefing_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_briefing_attendance_briefing_id ON briefing_attendance(briefing_id);

-- Create index on briefing_shares for faster queries
CREATE INDEX IF NOT EXISTS idx_briefing_shares_user_id ON briefing_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_briefing_shares_briefing_id ON briefing_shares(briefing_id);
