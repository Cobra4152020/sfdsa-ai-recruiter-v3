
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { challengeId, userId, videoUrl, tiktokUrl, metadata } = body

    if (!challengeId || !userId || !videoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Submit challenge
    const submission = await TikTokChallengeService.submitChallenge(challengeId, userId, videoUrl, tiktokUrl, metadata)

    if (!submission) {
      return NextResponse.json({ error: "Failed to submit challenge" }, { status: 500 })
    }

    return NextResponse.json({ submission })
  } catch (error) {
    console.error("Error submitting TikTok challenge:", error)
    return NextResponse.json({ error: "Failed to submit TikTok challenge" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const challengeId = url.searchParams.get("challengeId")
    const userId = url.searchParams.get("userId")

    if (challengeId) {
      // Get submissions for a challenge
      const submissions = await TikTokChallengeService.getSubmissionsForChallenge(Number.parseInt(challengeId))
      return NextResponse.json({ submissions })
    } else if (userId) {
      // Get submissions for a user
      const submissions = await TikTokChallengeService.getUserSubmissions(userId)
      return NextResponse.json({ submissions })
    } else {
      return NextResponse.json({ error: "Either challengeId or userId is required" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching TikTok challenge submissions:", error)
    return NextResponse.json({ error: "Failed to fetch TikTok challenge submissions" }, { status: 500 })
  }
}
