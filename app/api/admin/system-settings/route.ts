
export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-service"

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    const { data, error } = await supabase.from("system_settings").select("*").order("key")

    if (error) {
      console.error("Error fetching system settings:", error)
      return NextResponse.json({ error: "Failed to fetch system settings" }, { status: 500 })
    }

    return NextResponse.json({ settings: data })
  } catch (error) {
    console.error("Error in system settings GET route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const setting = await request.json()

    if (!setting.key || !setting.value) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    const { error } = await supabase.from("system_settings").upsert(
      {
        key: setting.key,
        value: setting.value,
        description: setting.description || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "key",
      },
    )

    if (error) {
      console.error("Error saving system setting:", error)
      return NextResponse.json({ error: "Failed to save system setting" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in system settings POST route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json({ error: "Key parameter is required" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    const { error } = await supabase.from("system_settings").delete().eq("key", key)

    if (error) {
      console.error("Error deleting system setting:", error)
      return NextResponse.json({ error: "Failed to delete system setting" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in system settings DELETE route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
