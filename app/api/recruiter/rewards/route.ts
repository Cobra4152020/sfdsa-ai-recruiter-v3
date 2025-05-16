
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { getAvailableRewards } from "@/lib/recruiter-rewards-service"

export async function GET() {
  try {
    const result = await getAvailableRewards()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in recruiter rewards GET:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
