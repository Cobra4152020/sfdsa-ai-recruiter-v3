-- Insert sample users
INSERT INTO users (id, name, email, avatar_url, bio, participation_count, has_applied, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', '/abstract-geometric-shapes.png', 'Aspiring Sheriff Deputy with a background in community service.', 5000, true, NOW() - INTERVAL '60 days'),
  ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', '/abstract-geometric-shapes.png', 'Former military looking to continue serving the community.', 4500, true, NOW() - INTERVAL '55 days'),
  ('33333333-3333-3333-3333-333333333333', 'Robert Johnson', 'robert@example.com', '/diverse-group-brainstorming.png', 'Criminal justice graduate eager to start a career in law enforcement.', 4200, true, NOW() - INTERVAL '50 days'),
  ('44444444-4444-4444-4444-444444444444', 'Emily Davis', 'emily@example.com', '/diverse-group-brainstorming.png', 'Passionate about public safety and community outreach.', 3800, false, NOW() - INTERVAL '45 days'),
  ('55555555-5555-5555-5555-555555555555', 'Michael Wilson', 'michael@example.com', '/abstract-geometric-shapes.png', 'Security professional looking to advance my career.', 3500, true, NOW() - INTERVAL '40 days'),
  ('66666666-6666-6666-6666-666666666666', 'Sarah Brown', 'sarah@example.com', '/placeholder.svg?height=64&width=64&query=user-66666666-6666-6666-6666-666666666666', 'Dedicated to serving and protecting the community.', 3200, false, NOW() - INTERVAL '35 days'),
  ('77777777-7777-7777-7777-777777777777', 'David Miller', 'david@example.com', '/placeholder.svg?height=64&width=64&query=user-77777777-7777-7777-7777-777777777777', 'Former teacher looking for a career change into law enforcement.', 2900, true, NOW() - INTERVAL '30 days'),
  ('88888888-8888-8888-8888-888888888888', 'Jennifer Taylor', 'jennifer@example.com', '/placeholder.svg?height=64&width=64&query=user-88888888-8888-8888-8888-888888888888', 'Psychology graduate interested in correctional services.', 2700, false, NOW() - INTERVAL '25 days'),
  ('99999999-9999-9999-9999-999999999999', 'James Anderson', 'james@example.com', '/placeholder.svg?height=64&width=64&query=user-99999999-9999-9999-9999-999999999999', 'Volunteer firefighter seeking to expand my public service career.', 2500, true, NOW() - INTERVAL '20 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Patricia Thomas', 'patricia@example.com', '/placeholder.svg?height=64&width=64&query=user-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Committed to making a positive impact in the community.', 2300, false, NOW() - INTERVAL '15 days')
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  participation_count = EXCLUDED.participation_count,
  has_applied = EXCLUDED.has_applied;

-- Insert NFT award tiers
INSERT INTO nft_award_tiers (id, name, description, image_url, point_threshold)
VALUES
  ('bronze', 'Bronze Recruit', 'Awarded for reaching 1,000 participation points', '/nft-awards/bronze-recruit.png', 1000),
  ('silver', 'Silver Recruit', 'Awarded for reaching 2,500 participation points', '/nft-awards/silver-recruit.png', 2500),
  ('gold', 'Gold Recruit', 'Awarded for reaching 5,000 participation points', '/nft-awards/gold-recruit.png', 5000),
  ('platinum', 'Platinum Recruit', 'Awarded for reaching 10,000 participation points', '/nft-awards/platinum-recruit.png', 10000)
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  point_threshold = EXCLUDED.point_threshold;

-- Insert sample badges
INSERT INTO badges (user_id, badge_type, earned_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'written', NOW() - INTERVAL '55 days'),
  ('11111111-1111-1111-1111-111111111111', 'oral', NOW() - INTERVAL '50 days'),
  ('11111111-1111-1111-1111-111111111111', 'physical', NOW() - INTERVAL '45 days'),
  ('11111111-1111-1111-1111-111111111111', 'polygraph', NOW() - INTERVAL '40 days'),
  ('11111111-1111-1111-1111-111111111111', 'psychological', NOW() - INTERVAL '35 days'),
  ('11111111-1111-1111-1111-111111111111', 'full', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111111', 'chat-participation', NOW() - INTERVAL '25 days'),
  ('11111111-1111-1111-1111-111111111111', 'resource-downloader', NOW() - INTERVAL '20 days'),
  
  ('22222222-2222-2222-2222-222222222222', 'written', NOW() - INTERVAL '50 days'),
  ('22222222-2222-2222-2222-222222222222', 'oral', NOW() - INTERVAL '45 days'),
  ('22222222-2222-2222-2222-222222222222', 'physical', NOW() - INTERVAL '40 days'),
  ('22222222-2222-2222-2222-222222222222', 'polygraph', NOW() - INTERVAL '35 days'),
  ('22222222-2222-2222-2222-222222222222', 'psychological', NOW() - INTERVAL '30 days'),
  ('22222222-2222-2222-2222-222222222222', 'chat-participation', NOW() - INTERVAL '25 days'),
  ('22222222-2222-2222-2222-222222222222', 'application-completed', NOW() - INTERVAL '20 days'),
  
  ('33333333-3333-3333-3333-333333333333', 'written', NOW() - INTERVAL '45 days'),
  ('33333333-3333-3333-3333-333333333333', 'oral', NOW() - INTERVAL '40 days'),
  ('33333333-3333-3333-3333-333333333333', 'physical', NOW() - INTERVAL '35 days'),
  ('33333333-3333-3333-3333-333333333333', 'chat-participation', NOW() - INTERVAL '30 days'),
  ('33333333-3333-3333-3333-333333333333', 'resource-downloader', NOW() - INTERVAL '25 days'),
  ('33333333-3333-3333-3333-333333333333', 'application-started', NOW() - INTERVAL '20 days')
ON CONFLICT (user_id, badge_type) DO NOTHING;

-- Insert sample NFT awards
INSERT INTO user_nft_awards (user_id, nft_award_id, points_at_award, awarded_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'bronze', 1000, NOW() - INTERVAL '50 days'),
  ('11111111-1111-1111-1111-111111111111', 'silver', 2500, NOW() - INTERVAL '40 days'),
  ('11111111-1111-1111-1111-111111111111', 'gold', 5000, NOW() - INTERVAL '30 days'),
  
  ('22222222-2222-2222-2222-222222222222', 'bronze', 1000, NOW() - INTERVAL '45 days'),
  ('22222222-2222-2222-2222-222222222222', 'silver', 2500, NOW() - INTERVAL '35 days'),
  
  ('33333333-3333-3333-3333-333333333333', 'bronze', 1000, NOW() - INTERVAL '40 days'),
  ('33333333-3333-3333-3333-333333333333', 'silver', 2500, NOW() - INTERVAL '30 days'),
  
  ('44444444-4444-4444-4444-444444444444', 'bronze', 1000, NOW() - INTERVAL '35 days'),
  ('44444444-4444-4444-4444-444444444444', 'silver', 2500, NOW() - INTERVAL '25 days'),
  
  ('55555555-5555-5555-5555-555555555555', 'bronze', 1000, NOW() - INTERVAL '30 days'),
  ('55555555-5555-5555-5555-555555555555', 'silver', 2500, NOW() - INTERVAL '20 days')
ON CONFLICT (user_id, nft_award_id) DO NOTHING;

-- Insert sample user engagement metrics
INSERT INTO user_engagement_metrics (user_id, page_views, chat_interactions, resource_downloads, quiz_completions, last_active_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 250, 45, 20, 15, NOW() - INTERVAL '1 day'),
  ('22222222-2222-2222-2222-222222222222', 220, 40, 18, 12, NOW() - INTERVAL '2 days'),
  ('33333333-3333-3333-3333-333333333333', 200, 35, 15, 10, NOW() - INTERVAL '3 days'),
  ('44444444-4444-4444-4444-444444444444', 180, 30, 12, 8, NOW() - INTERVAL '4 days'),
  ('55555555-5555-5555-5555-555555555555', 160, 25, 10, 6, NOW() - INTERVAL '5 days'),
  ('66666666-6666-6666-6666-666666666666', 140, 20, 8, 5, NOW() - INTERVAL '6 days'),
  ('77777777-7777-7777-7777-777777777777', 120, 15, 6, 4, NOW() - INTERVAL '7 days'),
  ('88888888-8888-8888-8888-888888888888', 100, 10, 5, 3, NOW() - INTERVAL '8 days'),
  ('99999999-9999-9999-9999-999999999999', 80, 8, 4, 2, NOW() - INTERVAL '9 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 60, 5, 3, 1, NOW() - INTERVAL '10 days')
ON CONFLICT (user_id) DO UPDATE
SET 
  page_views = EXCLUDED.page_views,
  chat_interactions = EXCLUDED.chat_interactions,
  resource_downloads = EXCLUDED.resource_downloads,
  quiz_completions = EXCLUDED.quiz_completions,
  last_active_at = EXCLUDED.last_active_at;

-- Insert sample point logs
INSERT INTO user_point_logs (user_id, points, action, created_at)
SELECT 
  id as user_id,
  50 as points,
  'Initial signup bonus' as action,
  created_at
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM user_point_logs WHERE action = 'Initial signup bonus' AND user_id = users.id
);

-- Add more varied point logs for the first user
INSERT INTO user_point_logs (user_id, points, action, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 25, 'Completed profile', NOW() - INTERVAL '59 days'),
  ('11111111-1111-1111-1111-111111111111', 75, 'Completed written test quiz', NOW() - INTERVAL '55 days'),
  ('11111111-1111-1111-1111-111111111111', 75, 'Completed oral board quiz', NOW() - INTERVAL '50 days'),
  ('11111111-1111-1111-1111-111111111111', 75, 'Completed physical test quiz', NOW() - INTERVAL '45 days'),
  ('11111111-1111-1111-1111-111111111111', 75, 'Completed polygraph quiz', NOW() - INTERVAL '40 days'),
  ('11111111-1111-1111-1111-111111111111', 75, 'Completed psychological quiz', NOW() - INTERVAL '35 days'),
  ('11111111-1111-1111-1111-111111111111', 100, 'Completed full process quiz', NOW() - INTERVAL '30 days'),
  ('11111111-1111-1111-1111-111111111111', 10, 'Daily login', NOW() - INTERVAL '25 days'),
  ('11111111-1111-1111-1111-111111111111', 10, 'Daily login', NOW() - INTERVAL '20 days'),
  ('11111111-1111-1111-1111-111111111111', 10, 'Daily login', NOW() - INTERVAL '15 days'),
  ('11111111-1111-1111-1111-111111111111', 10, 'Daily login', NOW() - INTERVAL '10 days'),
  ('11111111-1111-1111-1111-111111111111', 10, 'Daily login', NOW() - INTERVAL '5 days'),
  ('11111111-1111-1111-1111-111111111111', 10, 'Daily login', NOW() - INTERVAL '1 day');
