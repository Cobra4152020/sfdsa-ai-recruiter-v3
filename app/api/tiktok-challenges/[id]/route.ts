import { NextResponse } from "next/server"
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service"
import { verifyAdminAccess } from "@/lib/user-management-service-server"
import { generateTikTokChallengeStaticParams } from "@/lib/static-params"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 })
    }

    const challenge = await TikTokChallengeService.getChallengeById(id)

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    return NextResponse.json({ challenge })
  } catch (error) {
    console.error(`Error fetching TikTok challenge:`, error)
    return NextResponse.json({ error: "Failed to fetch TikTok challenge" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await req.json()
    const { adminId, challenge } = body

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 })
    }

    // Verify that the request is from an admin
    const isAdmin = await verifyAdminAccess(adminId)

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
    }

    // Update challenge
    const updatedChallenge = await TikTokChallengeService.updateChallenge(id, challenge)

    if (!updatedChallenge) {
      return NextResponse.json({ error: "Failed to update challenge" }, { status: 500 })
    }

    return NextResponse.json({ challenge: updatedChallenge })
  } catch (error) {
    console.error(`Error updating TikTok challenge:`, error)
    return NextResponse.json({ error: "Failed to update TikTok challenge" }, { status: 500 })
  }
}
