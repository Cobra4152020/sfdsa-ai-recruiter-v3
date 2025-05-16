import { NextResponse } from "next/server"

export const dynamic = 'force-static'

// Mock trivia diagnostics data
const STATIC_DIAGNOSTICS = {
  totalAttempts: 1000,
  averageScore: 85,
  completionRate: 92,
  topCategories: [
    { name: "Written Test", attempts: 400, averageScore: 88 },
    { name: "Oral Board", attempts: 300, averageScore: 82 },
    { name: "Physical Test", attempts: 200, averageScore: 90 },
    { name: "Department Knowledge", attempts: 100, averageScore: 85 }
  ],
  recentActivity: [
    {
      id: "1",
      userId: "test-user",
      category: "Written Test",
      score: 90,
      timestamp: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      userId: "test-user",
      category: "Oral Board",
      score: 85,
      timestamp: "2024-01-02T00:00:00Z"
    }
  ],
  lastUpdated: "2024-01-03T00:00:00Z"
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: STATIC_DIAGNOSTICS,
      source: 'static'
    })
  } catch (error) {
    console.error("Error fetching trivia diagnostics:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
