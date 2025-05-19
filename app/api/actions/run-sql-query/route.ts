import { NextResponse } from "next/server"
import { getServiceSupabase } from '@/app/lib/supabase/server'
import { revalidatePath } from "next/cache"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return []
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    const supabaseAdmin = getServiceSupabase()

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.rpc("exec_sql", { sql: query })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate any paths that might be affected by this query
    revalidatePath("/")

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Error executing SQL query:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 