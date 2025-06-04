// This file must only be imported in server components or API routes.
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

/**
 * Get the Supabase client for server components
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: unknown) {
          if (options && typeof options === "object") {
            cookieStore.set({ name, value, ...(options as object) });
          } else {
            cookieStore.set({ name, value });
          }
        },
        remove(name: string, options: unknown) {
          if (options && typeof options === "object") {
            cookieStore.set({ name, value: "", ...(options as object) });
          } else {
            cookieStore.set({ name, value: "" });
          }
        },
      },
    },
  );
}

/**
 * Get the Supabase client with service role for admin operations
 */
export function getServiceSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
