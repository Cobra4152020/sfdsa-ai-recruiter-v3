-- Insert sample badge collections
insert into public.badge_collections (id, name, description, theme) values
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Written Test', 'Badges for written test achievements', 'blue'),
  ('b5c2d3e4-6f7g-8h9i-j0k1-l2m3n4o5p6q7', 'Physical Test', 'Badges for physical fitness achievements', 'green'),
  ('a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6', 'Oral Interview', 'Badges for oral interview achievements', 'purple'),
  ('c4d5e6f7-8g9h-0i1j-2k3l-m4n5o6p7q8r9', 'Special Achievements', 'Special recognition badges', 'gold');

-- Insert sample badges
insert into public.badges (id, name, description, type, rarity, points, requirements, rewards, image_url) values
  ('d1e2f3g4-5h6i-7j8k-9l0m-n1o2p3q4r5s6', 'Written Test Master', 'Achieved excellence in written test', 'written', 'epic', 1000, 
   '{"score": 95, "attempts": 1}'::jsonb,
   '{"xp": 1000, "title": "Written Test Expert"}'::jsonb,
   '/images/badges/written-master.png'),
  
  ('e2f3g4h5-6i7j-8k9l-0m1n-o2p3q4r5s6t7', 'Physical Fitness Elite', 'Demonstrated exceptional physical fitness', 'physical', 'rare', 800,
   '{"running_time": "00:12:00", "pushups": 50, "situps": 50}'::jsonb,
   '{"xp": 800, "title": "Fitness Champion"}'::jsonb,
   '/images/badges/fitness-elite.png'),
  
  ('f3g4h5i6-7j8k-9l0m-1n2o-p3q4r5s6t7u8', 'Interview Excellence', 'Outstanding performance in oral interview', 'oral', 'epic', 1000,
   '{"score": 90, "communication": "excellent"}'::jsonb,
   '{"xp": 1000, "title": "Communication Expert"}'::jsonb,
   '/images/badges/interview-excellence.png'),
  
  ('g4h5i6j7-8k9l-0m1n-2o3p-q4r5s6t7u8v9', 'First Responder Ready', 'Completed all basic training requirements', 'full', 'legendary', 2000,
   '{"written_passed": true, "physical_passed": true, "oral_passed": true}'::jsonb,
   '{"xp": 2000, "title": "Certified First Responder"}'::jsonb,
   '/images/badges/first-responder.png');

-- Link badges to collections
insert into public.badge_collection_memberships (collection_id, badge_id, position) values
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'd1e2f3g4-5h6i-7j8k-9l0m-n1o2p3q4r5s6', 1),
  ('b5c2d3e4-6f7g-8h9i-j0k1-l2m3n4o5p6q7', 'e2f3g4h5-6i7j-8k9l-0m1n-o2p3q4r5s6t7', 1),
  ('a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6', 'f3g4h5i6-7j8k-9l0m-1n2o-p3q4r5s6t7u8', 1),
  ('c4d5e6f7-8g9h-0i1j-2k3l-m4n5o6p7q8r9', 'g4h5i6j7-8k9l-0m1n-2o3p-q4r5s6t7u8v9', 1);

-- Create sample challenges
insert into public.badge_challenges (id, name, description, badge_id, xp_reward, requirements, is_active) values
  ('h5i6j7k8-9l0m-1n2o-3p4q-r5s6t7u8v9w0', 'Weekly Written Test', 'Complete a practice written test with 90% or higher',
   'd1e2f3g4-5h6i-7j8k-9l0m-n1o2p3q4r5s6', 100,
   '{"min_score": 90, "time_limit": "01:00:00"}'::jsonb,
   true),
  
  ('i6j7k8l9-0m1n-2o3p-4q5r-s6t7u8v9w0x1', 'Daily Fitness Challenge', 'Complete the daily fitness routine',
   'e2f3g4h5-6i7j-8k9l-0m1n-o2p3q4r5s6t7', 50,
   '{"pushups": 30, "situps": 30, "run_distance": "2km"}'::jsonb,
   true),
  
  ('j7k8l9m0-1n2o-3p4q-5r6s-t7u8v9w0x1y2', 'Mock Interview Practice', 'Participate in a mock interview session',
   'f3g4h5i6-7j8k-9l0m-1n2o-p3q4r5s6t7u8', 75,
   '{"duration": "00:30:00", "min_score": 80}'::jsonb,
   true);

-- Initialize badge analytics
insert into public.badge_analytics (badge_id, total_earned, completion_rate, popularity_score) values
  ('d1e2f3g4-5h6i-7j8k-9l0m-n1o2p3q4r5s6', 0, 0, 0),
  ('e2f3g4h5-6i7j-8k9l-0m1n-o2p3q4r5s6t7', 0, 0, 0),
  ('f3g4h5i6-7j8k-9l0m-1n2o-p3q4r5s6t7u8', 0, 0, 0),
  ('g4h5i6j7-8k9l-0m1n-2o3p-q4r5s6t7u8v9', 0, 0, 0); 