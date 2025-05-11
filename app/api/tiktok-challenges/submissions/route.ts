import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { verifyAdminAccess } from "@/lib/user-management-service"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get("status") || "pending"
    const countOnly = url.searchParams.get("countOnly") === "true"
    const supabase = createClient()

    // Verify admin access for certain operations
    const isAdmin = await verifyAdminAccess("admin-id")
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    if (countOnly) {
      // Just get the count
      const { count, error } = await supabase
        .from("tiktok_challenge_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", status)

      if (error) throw error

      return NextResponse.json({ count })
    }

    // Get submissions with challenge and user details
    const { data, error } = await supabase
      .from("tiktok_challenge_submissions")
      .select(`
        *,
        challenge:tiktok_challenges(*),
        user:recruit.users(id, name, email, avatar_url)
      `)
      .eq("status", status)
      .order("submitted_at", { ascending: false })

    if (error) throw error

    // Format the response
    const submissions = data.map((submission) => ({
      id: submission.id,
      challengeId: submission.challenge_id,
      userId: submission.user_id,
      videoUrl: submission.video_url,
      tiktokUrl: submission.tiktok_url,
      status: submission.status,
      submittedAt: submission.submitted_at,
      challenge: {
        title: submission.challenge.title,
        pointsReward: submission.challenge.points_reward,
      },
      user: {
        name: submission.user.name,
        email: submission.user.email,
        avatarUrl: submission.user.avatar_url,
      },
    }))

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error fetching TikTok challenge submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { challengeId, userId, videoUrl, tiktokUrl, metadata } = body
    const supabase = createClient()

    if (!challengeId || !userId || !videoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Submit challenge
    const { data, error } = await supabase
      .from("tiktok_challenge_submissions")
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        video_url: videoUrl,
        tiktok_url: tiktokUrl || null,
        metadata: metadata || {},
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ submission: data })
  } catch (error) {
    console.error("Error submitting TikTok challenge:", error)
    return NextResponse.json({ error: "Failed to submit challenge" }, { status: 500 })
  }
}
