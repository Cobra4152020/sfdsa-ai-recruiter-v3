-- Schema for the Application Process Gamification

-- 1. Define the application steps
CREATE TABLE IF NOT EXISTS public.application_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_order INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    points_awarded INT NOT NULL,
    badge_id_on_completion UUID REFERENCES public.badges(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(step_order),
    UNIQUE(title)
);

-- 2. Track user progress for each step
CREATE TABLE IF NOT EXISTS public.user_application_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    step_id UUID REFERENCES public.application_steps(id) ON DELETE CASCADE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, step_id)
);

-- 3. Populate the application steps with the data from the component
INSERT INTO public.application_steps (step_order, title, description, points_awarded, badge_id_on_completion)
VALUES
    (1, 'Complete Your Profile', 'Fill out your basic information and upload a photo', 50, NULL),
    (2, 'Upload Required Documents', 'Submit your ID, education certificates, and references', 100, (SELECT id from public.badges WHERE name = 'Documentation Pro' LIMIT 1)),
    (3, 'Take Initial Assessment', 'Complete the preliminary skills and aptitude assessment', 150, NULL),
    (4, 'Schedule Interview', 'Book your initial interview with a recruitment officer', 200, (SELECT id from public.badges WHERE name = 'Interview Ready' LIMIT 1)),
    (5, 'Physical Fitness Test', 'Schedule and prepare for your physical fitness assessment', 250, NULL),
    (6, 'Background Check', 'Submit information for your background check', 300, (SELECT id from public.badges WHERE name = 'Background Verified' LIMIT 1)),
    (7, 'Final Application Review', 'Your application is being reviewed by the recruitment team', 500, (SELECT id from public.badges WHERE name = 'Application Champion' LIMIT 1))
ON CONFLICT (title) DO NOTHING;


-- 4. Enable RLS
ALTER TABLE public.application_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_application_progress ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Allow all authenticated users to read the defined application steps
CREATE POLICY "Allow authenticated read on application_steps" ON public.application_steps
    FOR SELECT TO authenticated USING (true);

-- Users can view their own application progress
CREATE POLICY "Users can view their own application progress" ON public.user_application_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert their own application progress" ON public.user_application_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own application progress" ON public.user_application_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_application_progress_user_id ON public.user_application_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_application_progress_step_id ON public.user_application_progress(step_id); 