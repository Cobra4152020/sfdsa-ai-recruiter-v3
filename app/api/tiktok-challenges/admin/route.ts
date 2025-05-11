import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { verifyAdminAccess } from "@/lib/user-management-service"

export async function GET(req: Request) {
  try {
    const supabase = createClient()

    // Verify admin access (in a real app, you'd get the admin ID from the session)
    const isAdmin = await verifyAdminAccess("admin-id")
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // Get all challenges with submission counts
    const { data: challenges, error } = await supabase
      .from("tiktok_challenges")
      .select(`
        *,
        tiktok_challenge_submissions:tiktok_challenge_submissions(count)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Format the response
    const formattedChallenges = challenges.map((challenge) => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      startDate: challenge.start_date,
      endDate: challenge.end_date,
      pointsReward: challenge.points_reward,
      badgeReward: challenge.badge_reward,
      hashtags: challenge.hashtags,
      status: challenge.status,
      submissionCount: challenge.tiktok_challenge_submissions?.[0]?.count || 0,
    }))

    return NextResponse.json({ challenges: formattedChallenges })
  } catch (error) {
    console.error("Error fetching TikTok challenges for admin:", error)
    return NextResponse.json({ error: "Failed to fetch TikTok challenges" }, { status: 500 })
  }
}
