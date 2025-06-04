import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
    throw new Error("Supabase URL is not configured. Please check your environment variables.");
  }

  if (!supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
    throw new Error("Supabase anonymous key is not configured. Please check your environment variables.");
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    throw new Error("Failed to initialize authentication service. Please try again later.");
  }
};

// Export getClientSideSupabase as an alias for createClient
export const getClientSideSupabase = createClient;
