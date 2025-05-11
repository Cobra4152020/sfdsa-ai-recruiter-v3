import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { verifyAdminAccess } from "@/lib/user-management-service"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const supabase = createClient()

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 })
    }

    // Get challenge details
    const { data, error } = await supabase.from("tiktok_challenges").select("*").eq("id", id).single()

    if (error) throw error

    return NextResponse.json({ challenge: data })
  } catch (error) {
    console.error("Error fetching TikTok challenge:", error)
    return NextResponse.json({ error: "Failed to fetch challenge" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await req.json()
    const {
      title,
      description,
      instructions,
      hashtags,
      startDate,
      endDate,
      pointsReward,
      badgeReward,
      exampleVideoUrl,
      thumbnailUrl,
    } = body
    const supabase = createClient()

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 })
    }

    // Verify admin access (in a real app, you'd get the admin ID from the session)
    const isAdmin = await verifyAdminAccess("admin-id")
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // Update challenge
    const { data, error } = await supabase
      .from("tiktok_challenges")
      .update({
        title,
        description,
        instructions,
        hashtags,
        start_date: startDate,
        end_date: endDate,
        points_reward: pointsReward,
        badge_reward: badgeReward || null,
        example_video_url: exampleVideoUrl || null,
        thumbnail_url: thumbnailUrl || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ challenge: data })
  } catch (error) {
    console.error("Error updating TikTok challenge:", error)
    return NextResponse.json({ error: "Failed to update challenge" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const supabase = createClient()

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 })
    }

    // Verify admin access (in a real app, you'd get the admin ID from the session)
    const isAdmin = await verifyAdminAccess("admin-id")
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // Delete challenge
    const { error } = await supabase.from("tiktok_challenges").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting TikTok challenge:", error)
    return NextResponse.json({ error: "Failed to delete challenge" }, { status: 500 })
  }
}
