-- Update mock domains in daily_briefings database
-- Run this SQL in your Supabase SQL Editor

-- Update any call_to_action fields that contain mock recruitment domains
UPDATE daily_briefings 
SET call_to_action = REPLACE(call_to_action, 'https://your-recruitment-site.com', 'https://sfdeputysheriff.com/')
WHERE call_to_action LIKE '%your-recruitment-site.com%';

-- Update any call_to_action fields that contain other common mock domains
UPDATE daily_briefings 
SET call_to_action = REPLACE(call_to_action, 'https://recruitment-site.com', 'https://sfdeputysheriff.com/')
WHERE call_to_action LIKE '%recruitment-site.com%';

-- Update any call_to_action fields that contain example.com
UPDATE daily_briefings 
SET call_to_action = REPLACE(call_to_action, 'https://example.com', 'https://sfdeputysheriff.com/')
WHERE call_to_action LIKE '%example.com%';

-- Update any call_to_action fields that contain placeholder domains
UPDATE daily_briefings 
SET call_to_action = REPLACE(call_to_action, 'https://yoursite.com', 'https://sfdeputysheriff.com/')
WHERE call_to_action LIKE '%yoursite.com%';

-- Update sgt_ken_take field if it contains mock domains
UPDATE daily_briefings 
SET sgt_ken_take = REPLACE(sgt_ken_take, 'https://your-recruitment-site.com', 'https://sfdeputysheriff.com/')
WHERE sgt_ken_take LIKE '%your-recruitment-site.com%';

-- Also update any existing HTTP references to use HTTPS
UPDATE daily_briefings 
SET call_to_action = REPLACE(call_to_action, 'http://sfdeputysheriff.com', 'https://sfdeputysheriff.com/')
WHERE call_to_action LIKE '%http://sfdeputysheriff.com%';

UPDATE daily_briefings 
SET sgt_ken_take = REPLACE(sgt_ken_take, 'http://sfdeputysheriff.com', 'https://sfdeputysheriff.com/')
WHERE sgt_ken_take LIKE '%http://sfdeputysheriff.com%';

-- Show all records that were updated to verify changes
SELECT id, theme, call_to_action, sgt_ken_take 
FROM daily_briefings 
WHERE call_to_action LIKE '%sfdeputysheriff.com%' 
   OR sgt_ken_take LIKE '%sfdeputysheriff.com%'
LIMIT 10; 