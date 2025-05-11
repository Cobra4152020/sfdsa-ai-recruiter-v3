import { NextResponse } from "next/server"
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service"
import { verifyAdminAccess } from "@/lib/user-management-service"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await req.json()
    const { adminId, status, feedback } = body

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

    // Review submission
    const submission = await TikTokChallengeService.reviewSubmission(id, status as "approved" | "rejected", feedback)

    if (!submission) {
      return NextResponse.json({ error: "Failed to review submission" }, { status: 500 })
    }

    return NextResponse.json({ submission })
  } catch (error) {
    console.error("Error reviewing TikTok challenge submission:", error)
    return NextResponse.json({ error: "Failed to review TikTok challenge submission" }, { status: 500 })
  }
}
