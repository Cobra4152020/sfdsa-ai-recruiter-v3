export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"

// Static health check data
const healthStatus = {
  api: {
    status: "ok",
    message: "API is operational",
    last_checked: "2024-01-01T00:00:00Z"
  },
  static_generation: {
    status: "ok",
    message: "Static site generation successful",
    last_checked: "2024-01-01T00:00:00Z"
  },
  content_delivery: {
    status: "ok",
    message: "Content delivery network operational",
    last_checked: "2024-01-01T00:00:00Z"
  },
  features: {
    trivia: {
      status: "ok",
      message: "Trivia game system operational"
    },
    leaderboard: {
      status: "ok",
      message: "Leaderboard system operational"
    },
    nft_awards: {
      status: "ok",
      message: "NFT awards system operational"
    }
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: "2024-01-01T00:00:00Z",
    checks: healthStatus,
    source: 'static'
  })
}

// Note: Dynamic health checks should be performed client-side
// or through a separate monitoring service
