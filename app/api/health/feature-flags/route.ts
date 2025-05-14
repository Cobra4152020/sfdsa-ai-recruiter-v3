import { NextResponse } from "next/server"
import { API_CACHE_HEADERS } from "@/lib/cache-utils"

export async function GET() {
  try {
    const featureFlags = {
      leaderboard: process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === "true",
      badges: process.env.NEXT_PUBLIC_ENABLE_BADGES === "true",
      points: process.env.NEXT_PUBLIC_ENABLE_POINTS === "true",
      debug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
    }

    const disabledFeatures = Object.entries(featureFlags)
      .filter(([_, enabled]) => !enabled)
      .map(([feature]) => feature)

    if (disabledFeatures.length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: `Some features are disabled: ${disabledFeatures.join(", ")}`,
          features: featureFlags,
        },
        { headers: API_CACHE_HEADERS },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "All features are enabled",
        features: featureFlags,
      },
      { headers: API_CACHE_HEADERS },
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Feature flags health check failed: ${error}` },
      { status: 500, headers: API_CACHE_HEADERS },
    )
  }
}
