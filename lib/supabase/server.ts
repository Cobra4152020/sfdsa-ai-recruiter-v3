import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase environment variables")
    // Return a mock client that won't throw errors
    return {
      from: () => ({
        select: () => ({
          order: () => ({
            data: [],
            error: null,
          }),
        }),
        insert: () => ({
          select: () => ({
            data: [],
            error: null,
          }),
        }),
      }),
    } as any
  }

  const cookieStore = cookies()

  try {
    return createSupabaseClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a mock client that won't throw errors
    return {
      from: () => ({
        select: () => ({
          order: () => ({
            data: [],
            error: null,
          }),
        }),
        insert: () => ({
          select: () => ({
            data: [],
            error: null,
          }),
        }),
      }),
    } as any
  }
}
