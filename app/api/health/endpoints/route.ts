
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"
import { API_CACHE_HEADERS } from "@/lib/cache-utils"

export async function GET() {
  try {
    const endpoints = ["/api/leaderboard", "/api/badges", "/api/users/current/profile"]

    const results = []

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}${endpoint}`)
        results.push({
          endpoint,
          status: response.status,
          ok: response.ok,
        })
      } catch (error) {
        results.push({
          endpoint,
          status: 0,
          ok: false,
          error: `${error}`,
        })
      }
    }

    const failedEndpoints = results.filter((r) => !r.ok)

    if (failedEndpoints.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `${failedEndpoints.length} endpoints failed health check`,
          details: results,
        },
        { status: 500, headers: API_CACHE_HEADERS },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "All API endpoints are healthy",
        details: results,
      },
      { headers: API_CACHE_HEADERS },
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `API endpoints health check failed: ${error}` },
      { status: 500, headers: API_CACHE_HEADERS },
    )
  }
}
