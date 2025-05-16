
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { API_CACHE_HEADERS } from "@/lib/cache-utils"

export async function GET() {
  try {
    const assets = [
      "/abstract-geometric-shapes.png",
      "/document-icon.png",
      "/fitness-icon.png",
      "/psychology-icon.png",
      "/chat-icon.png",
      "/generic-badge.png",
    ]

    const results = []

    for (const asset of assets) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}${asset}`)
        results.push({
          asset,
          status: response.status,
          ok: response.ok,
        })
      } catch (error) {
        results.push({
          asset,
          status: 0,
          ok: false,
          error: `${error}`,
        })
      }
    }

    const missingAssets = results.filter((r) => !r.ok)

    if (missingAssets.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `${missingAssets.length} assets failed health check`,
          details: results,
        },
        { status: 500, headers: API_CACHE_HEADERS },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "All assets are accessible",
        details: results,
      },
      { headers: API_CACHE_HEADERS },
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Assets health check failed: ${error}` },
      { status: 500, headers: API_CACHE_HEADERS },
    )
  }
}
