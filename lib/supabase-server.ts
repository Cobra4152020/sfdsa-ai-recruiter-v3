import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"
import { createClient as createBrowserClient } from "@supabase/supabase-js"

export function createClient() {
  if (typeof window === "undefined") {
    return createPagesServerClient<Database>()
  } else {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
}
