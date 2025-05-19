import { NextResponse } from "next/server"
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service"
import { verifyAdminAccess } from '@/lib/user-management-service-server'

export const dynamic = 'force-static'

// Mock challenges for static export
const STATIC_CHALLENGES = [
  {
    id: "1",
    title: "SFDA Dance Challenge",
    description: "Show your moves in uniform! Share your best dance moves while representing SFDA.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    points: 100,
    active: true,
    requirements: ["Must be in uniform", "Keep it professional", "Use #SFDADance hashtag"],
    completed: false
  },
  {
    id: "2",
    title: "Community Connection",
    description: "Share a moment of positive community interaction while on duty.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    points: 150,
    active: true,
    requirements: ["Must show positive interaction", "Get permission to share", "Use #SFDACommunity hashtag"],
    completed: false
  },
  {
    id: "3",
    title: "Training Day",
    description: "Share a glimpse of your training routine or preparation for the academy.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    points: 120,
    active: true,
    requirements: ["Focus on training activities", "Show proper form", "Use #SFDATraining hashtag"],
    completed: false
  }
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    // If userId is provided, return challenges with completion status
    if (userId) {
      return NextResponse.json({ 
        challenges: STATIC_CHALLENGES,
        source: 'static'
      })
    }

    // Otherwise return all active challenges
    return NextResponse.json({ 
      challenges: STATIC_CHALLENGES.filter(c => c.active),
      source: 'static'
    })
  } catch (error) {
    console.error("Error fetching TikTok challenges:", error)
    return NextResponse.json({ 
      error: "Failed to fetch TikTok challenges",
      source: 'error'
    }, { status: 500 })
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
