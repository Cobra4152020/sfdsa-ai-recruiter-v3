import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ success: true, message: "Analytics recorded" })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Analytics data received:", data)

    // Here you would typically store this data in a database

    return NextResponse.json({ success: true, message: "Analytics recorded" })
  } catch (error) {
    console.error("Error processing analytics:", error)
    return NextResponse.json({ success: false, message: "Failed to record analytics" }, { status: 500 })
  }
}

// Support all HTTP methods
export const dynamic = "force-dynamic"
