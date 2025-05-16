
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour;

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { urls } = await request.json()

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No URLs provided",
        },
        { status: 400 },
      )
    }

    // Check each URL
    const results = await Promise.all(
      urls.map(async (url: string) => {
        try {
          // For internal URLs, make them absolute
          const fullUrl = url.startsWith("/")
            ? `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}${url}`
            : url

          const response = await fetch(fullUrl, { method: "HEAD" })

          return {
            url,
            status: response.status,
            ok: response.ok,
            message: response.ok ? "Link is valid" : `HTTP error: ${response.status}`,
          }
        } catch (error) {
          return {
            url,
            status: 0,
            ok: false,
            message: error instanceof Error ? error.message : "Unknown error checking link",
          }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Link check error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error checking links",
      },
      { status: 500 },
    )
  }
}
