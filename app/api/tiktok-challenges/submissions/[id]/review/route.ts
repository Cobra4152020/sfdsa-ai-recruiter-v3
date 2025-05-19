import { NextResponse } from "next/server"
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service"
import { verifyAdminAccess } from "@/lib/user-management-service-server"
import { generateTikTokSubmissionStaticParams } from "@/lib/static-params"

// GET method is static for pre-rendering
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

// GET method returns submission status
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const submissionId = Number.parseInt(params.id)
    
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 })
    }

    const submission = await TikTokChallengeService.getSubmissionById(submissionId)

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    return NextResponse.json({ submission })
  } catch (error) {
    console.error("Error fetching TikTok challenge submission:", error)
    return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 })
  }
}

// POST method for handling reviews
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
