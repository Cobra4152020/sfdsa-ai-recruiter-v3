
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { setupDailyBriefingsTable } from "@/lib/daily-briefing-setup"

export async function POST() {
  try {
    const result = await setupDailyBriefingsTable()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in setup-daily-briefings API:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
