
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { getRecruiterStats } from "@/lib/recruiter-rewards-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recruiterId = searchParams.get("recruiterId")

    if (!recruiterId) {
      return NextResponse.json({ success: false, message: "Recruiter ID is required" }, { status: 400 })
    }

    const result = await getRecruiterStats(recruiterId)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in recruiter stats GET:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
