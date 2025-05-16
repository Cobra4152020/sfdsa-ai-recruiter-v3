import { NextResponse } from "next/server"
import type { BadgeType } from "@/lib/badge-utils"

export const dynamic = 'force-static'

// Static mock data for badges
const mockBadges = [
  {
    id: "1",
    user_id: "test-user",
    badge_type: "written" as BadgeType,
    earned_at: "2024-01-01T00:00:00Z",
    name: "Written Test",
    description: "Completed written test preparation",
    category: "application",
    color: "bg-blue-500",
    icon: "/placeholder.svg?key=t6kke",
  },
  {
    id: "2",
    user_id: "test-user",
    badge_type: "oral" as BadgeType,
    earned_at: "2024-01-02T00:00:00Z",
    name: "Oral Board",
    description: "Prepared for oral board interviews",
    category: "application",
    color: "bg-green-700",
    icon: "/placeholder.svg?key=409vx",
  },
  {
    id: "3",
    user_id: "test-user",
    badge_type: "physical" as BadgeType,
    earned_at: "2024-01-03T00:00:00Z",
    name: "Physical Test",
    description: "Completed physical test preparation",
    category: "application",
    color: "bg-blue-700",
    icon: "/placeholder.svg?key=j0utq",
  }
]

// Generate static paths for all user IDs
export function generateStaticParams() {
  return [
    { id: 'test-user' },
    { id: 'user1' },
    { id: 'user2' },
    { id: 'user3' }
  ]
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    // Filter badges for this user
    const userBadges = mockBadges.filter(badge => badge.user_id === userId)

    return NextResponse.json({
      success: true,
      badges: userBadges,
      source: 'static'
    })
  } catch (error) {
    console.error("Error fetching user badges:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const { badge_type } = await request.json()

    if (!badge_type) {
      return NextResponse.json({ success: false, message: "Badge type is required" }, { status: 400 })
    }

    // Create a new badge based on the type
    const newBadge = {
      id: (mockBadges.length + 1).toString(),
      user_id: userId,
      badge_type,
      earned_at: new Date().toISOString(),
      name: "New Badge",
      description: "Badge description",
      category: "participation",
      color: "bg-blue-500",
      icon: "/placeholder.svg",
    }

    mockBadges.push(newBadge)

    return NextResponse.json({ success: true, badge: newBadge })
  } catch (error) {
    console.error("Error awarding badge:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
