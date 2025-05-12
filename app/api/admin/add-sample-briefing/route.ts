import { NextResponse } from "next/server"
import { addSampleBriefing } from "@/lib/daily-briefing-setup"

export async function POST() {
  try {
    const result = await addSampleBriefing()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in add-sample-briefing API:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
