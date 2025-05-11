import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { verifyAdminAccess } from "@/lib/user-management-service"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const supabase = createClient()

    if (userId) {
      // Get challenges with completion status for user
      const { data, error } = await supabase.rpc("get_challenges_with_completion", {
        p_user_id: userId,
      })

      if (error) throw error

      return NextResponse.json({ challenges: data })
    } else {
      // Get all active challenges
      const { data, error } = await supabase.from("active_tiktok_challenges").select("*")

      if (error) throw error

      return NextResponse.json({ challenges: data })
    }
  } catch (error) {
    console.error("Error fetching TikTok challenges:", error)
    return NextResponse.json({ error: "Failed to fetch TikTok challenges" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
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

    // Verify admin access (in a real app, you'd get the admin ID from the session)
    const isAdmin = await verifyAdminAccess("admin-id")
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // Create new challenge
    const { data, error } = await supabase
      .from("tiktok_challenges")
      .insert({
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
        status: "active",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ challenge: data })
  } catch (error) {
    console.error("Error creating TikTok challenge:", error)
    return NextResponse.json({ error: "Failed to create TikTok challenge" }, { status: 500 })
  }
}
