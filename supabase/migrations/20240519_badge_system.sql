-- Enable RLS (Row Level Security)
alter table public.users enable row level security;

-- Create badge types enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'badge_type') THEN
    CREATE TYPE badge_type AS ENUM (
      'written', 'oral', 'physical', 'polygraph', 'psychological', 'full',
      'chat-participation', 'first-response', 'application-started', 'application-completed',
      'frequent-user', 'resource-downloader', 'hard-charger', 'connector',
      'deep-diver', 'quick-learner', 'persistent-explorer', 'dedicated-applicant'
    );
  END IF;
END$$;

-- Create badge collections table
create table public.badge_collections (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  theme text default 'default',
  special_reward text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create badges table
create table public.badges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  type badge_type not null,
  rarity text not null,
  points integer default 0,
  requirements jsonb,
  rewards jsonb,
  image_url text,
  tier_enabled boolean default false,
  max_tier integer,
  parent_badge_id uuid references public.badges(id),
  expiration_days integer,
  verification_required boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create badge collection memberships table
create table public.badge_collection_memberships (
  id uuid default gen_random_uuid() primary key,
  collection_id uuid references public.badge_collections(id) on delete cascade not null,
  badge_id uuid references public.badges(id) on delete cascade not null,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(collection_id, badge_id)
);

-- Create user XP table
create table public.user_xp (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  total_xp integer default 0,
  current_level integer default 1,
  last_daily_challenge timestamp with time zone,
  streak_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create badge challenges table
create table public.badge_challenges (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  badge_id uuid references public.badges(id) on delete cascade,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  xp_reward integer default 0,
  requirements jsonb not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user challenge progress table
create table public.user_challenge_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  challenge_id uuid references public.badge_challenges(id) on delete cascade not null,
  progress jsonb default '{}'::jsonb,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, challenge_id)
);

-- Create badge showcase settings table
create table public.badge_showcase_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  layout_type text default 'grid',
  featured_badges uuid[] default array[]::uuid[],
  showcase_theme text default 'default',
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create user badge preferences table
create table public.user_badge_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  display_style text default 'standard',
  notification_settings jsonb default '{"email": true, "push": true}'::jsonb,
  pinned_badges uuid[] default array[]::uuid[],
  custom_goals jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Create badge analytics table
create table public.badge_analytics (
  badge_id uuid primary key references public.badges(id) on delete cascade,
  total_earned integer default 0,
  completion_rate decimal(5,2) default 0,
  average_time_to_earn interval,
  popularity_score decimal(5,2) default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create badge progress table
create table public.badge_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_id uuid references public.badges(id) on delete cascade not null,
  progress integer default 0,
  is_unlocked boolean default false,
  unlocked_at timestamp with time zone,
  actions_completed jsonb default '[]'::jsonb,
  last_action_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, badge_id)
);

-- Create badge shares table
create table public.badge_shares (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_id uuid references public.badges(id) on delete cascade not null,
  platform text not null,
  share_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
create policy "Enable read access for all users" on public.badge_collections
  for select using (true);

create policy "Enable read access for all users" on public.badges
  for select using (true);

create policy "Enable read access for all users" on public.badge_collection_memberships
  for select using (true);

create policy "Enable read access for authenticated users" on public.user_xp
  for select using (auth.uid() = user_id);

create policy "Enable update for authenticated users" on public.user_xp
  for update using (auth.uid() = user_id);

create policy "Enable read access for all users" on public.badge_challenges
  for select using (true);

create policy "Enable read access for authenticated users" on public.user_challenge_progress
  for select using (auth.uid() = user_id);

create policy "Enable update for authenticated users" on public.user_challenge_progress
  for update using (auth.uid() = user_id);

create policy "Enable read access for authenticated users" on public.badge_showcase_settings
  for select using (auth.uid() = user_id);

create policy "Enable update for authenticated users" on public.badge_showcase_settings
  for update using (auth.uid() = user_id);

create policy "Enable read access for authenticated users" on public.user_badge_preferences
  for select using (auth.uid() = user_id);

create policy "Enable update for authenticated users" on public.user_badge_preferences
  for update using (auth.uid() = user_id);

create policy "Enable read access for authenticated users" on public.badge_progress
  for select using (auth.uid() = user_id);

create policy "Enable update for authenticated users" on public.badge_progress
  for update using (auth.uid() = user_id);

create policy "Enable read access for all users" on public.badge_shares
  for select using (true);

create policy "Enable insert for authenticated users" on public.badge_shares
  for insert with check (auth.uid() = user_id);

-- Create functions and triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
create trigger handle_updated_at
  before update on public.badge_collections
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.badges
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.user_xp
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.badge_challenges
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.user_challenge_progress
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.badge_showcase_settings
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.user_badge_preferences
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.badge_progress
  for each row
  execute procedure public.handle_updated_at();

-- Create function to update badge analytics
create or replace function update_badge_analytics()
returns trigger as $$
begin
  -- Update analytics when a badge is earned
  if new.is_unlocked = true and old.is_unlocked = false then
    update badge_analytics
    set 
      total_earned = total_earned + 1,
      completion_rate = (
        select cast(count(*) as decimal) / 
               (select count(*) from badge_progress where badge_id = new.badge_id) * 100
        from badge_progress 
        where badge_id = new.badge_id and is_unlocked = true
      ),
      average_time_to_earn = (
        select avg(unlocked_at - created_at)
        from badge_progress
        where badge_id = new.badge_id and is_unlocked = true
      ),
      updated_at = timezone('utc'::text, now())
    where badge_id = new.badge_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger update_badge_analytics_on_progress
  after update of is_unlocked on public.badge_progress
  for each row
  execute function update_badge_analytics(); 