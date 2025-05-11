import { NextResponse } from "next/server"
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service"
import { verifyAdminAccess } from "@/lib/user-management-service"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (userId) {
      // Get challenges with completion status for user
      const challenges = await TikTokChallengeService.getChallengesForUser(userId)
      return NextResponse.json({ challenges })
    } else {
      // Get all active challenges
      const challenges = await TikTokChallengeService.getActiveChallenges()
      return NextResponse.json({ challenges })
    }
  } catch (error) {
    console.error("Error fetching TikTok challenges:", error)
    return NextResponse.json({ error: "Failed to fetch TikTok challenges" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { adminId, challenge } = body

    // Verify that the request is from an admin
    const isAdmin = await verifyAdminAccess(adminId)

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // Create new challenge
    const newChallenge = await TikTokChallengeService.createChallenge(challenge)

    if (!newChallenge) {
      return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 })
    }

    return NextResponse.json({ challenge: newChallenge })
  } catch (error) {
    console.error("Error creating TikTok challenge:", error)
    return NextResponse.json({ error: "Failed to create TikTok challenge" }, { status: 500 })
  }
}
