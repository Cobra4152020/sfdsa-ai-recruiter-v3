import { NextResponse } from "next/server"
import { TikTokChallengeService } from "@/lib/tiktok-challenge-service"
import { generateTikTokSubmissionStaticParams } from "@/lib/static-params"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "1" }, { id: "2" }, { id: "3" }]
}

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