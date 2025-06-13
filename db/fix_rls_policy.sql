CREATE POLICY "Allow individual read access"
ON public.trivia_game_results
FOR SELECT
USING (auth.uid() = user_id); 