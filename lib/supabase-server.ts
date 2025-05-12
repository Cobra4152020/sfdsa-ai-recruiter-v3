import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

export function createClient() {
  if (typeof window === "undefined") {
    // Server-side
    return createServerComponentClient<Database>({ cookies })
  } else {
    // Client-side
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
}
