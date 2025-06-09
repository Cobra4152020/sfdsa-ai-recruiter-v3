-- Create the missing trivia_game_results table
CREATE TABLE IF NOT EXISTS public.trivia_game_results (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    game_id TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Add constraint to reference profiles table
    CONSTRAINT fk_trivia_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trivia_game_results_user_id ON public.trivia_game_results(user_id);
CREATE INDEX IF NOT EXISTS idx_trivia_game_results_game_id ON public.trivia_game_results(game_id);
CREATE INDEX IF NOT EXISTS idx_trivia_game_results_created_at ON public.trivia_game_results(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.trivia_game_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own trivia results" ON public.trivia_game_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trivia results" ON public.trivia_game_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trivia results" ON public.trivia_game_results
    FOR UPDATE USING (auth.uid() = user_id); 