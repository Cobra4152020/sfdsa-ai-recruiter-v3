import { NextResponse } from "next/server"
import { getUserDonationPoints } from "@/lib/donation-points-service"
import { generateUserStaticParams } from "@/lib/static-params"

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

export async function generateStaticParams() {
  // Add dummy params for testing
  return [{ id: "user1" }, { id: "user2" }, { id: "user3" }]
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const result = await getUserDonationPoints(userId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching user donation points:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
} 