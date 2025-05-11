import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { verifyAdminAccess } from "@/lib/user-management-service"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await req.json()
    const { adminId, status, feedback } = body
    const supabase = createClient()

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 })
    }

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Verify that the request is from an admin
    const isAdmin = await verifyAdminAccess(adminId)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // First, get the submission to check if it's already been reviewed
    const { data: existingSubmission, error: fetchError } = await supabase
      .from("tiktok_challenge_submissions")
      .select("status, user_id, challenge_id")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    if (existingSubmission.status !== "pending") {
      return NextResponse.json(
        {
          error: "This submission has already been reviewed",
        },
        { status: 400 },
      )
    }

    // Update the submission status
    const { data, error } = await supabase
      .from("tiktok_challenge_submissions")
      .update({
        status,
        admin_feedback: feedback || null,
        verified_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // If approved, award points to the user
    if (status === "approved") {
      // Get the challenge to determine points
      const { data: challenge, error: challengeError } = await supabase
        .from("tiktok_challenges")
        .select("points_reward, badge_reward")
        .eq("id", existingSubmission.challenge_id)
        .single()

      if (challengeError) throw challengeError

      // Award points to the user
      const { error: pointsError } = await supabase
        .from("recruit.users")
        .update({
          points: supabase.rpc("increment", { inc: challenge.points_reward }),
        })
        .eq("id", existingSubmission.user_id)

      if (pointsError) throw pointsError

      // If there's a badge reward, award it
      if (challenge.badge_reward) {
        // This would be implemented based on your badge system
        // For example:
        // await awardBadgeToUser(existingSubmission.user_id, challenge.badge_reward)
      }

      // Create a notification for the user
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: existingSubmission.user_id,
        type: "challenge_approved",
        title: "TikTok Challenge Approved!",
        message: `Your submission has been approved! You've earned ${challenge.points_reward} points.`,
        data: {
          challenge_id: existingSubmission.challenge_id,
          submission_id: id,
          points_awarded: challenge.points_reward,
        },
        read: false,
      })

      if (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue even if notification fails
      }
    } else if (status === "rejected" && feedback) {
      // Create a notification for the rejected submission
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: existingSubmission.user_id,
        type: "challenge_rejected",
        title: "TikTok Challenge Needs Revision",
        message: "Your submission needs some changes. Check the feedback for details.",
        data: {
          challenge_id: existingSubmission.challenge_id,
          submission_id: id,
          feedback,
        },
        read: false,
      })

      if (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue even if notification fails
      }
    }

    return NextResponse.json({ submission: data })
  } catch (error) {
    console.error("Error reviewing TikTok challenge submission:", error)
    return NextResponse.json({ error: "Failed to review submission" }, { status: 500 })
  }
}
