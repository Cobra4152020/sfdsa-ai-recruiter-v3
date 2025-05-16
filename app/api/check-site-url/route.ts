
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get environment variables
    const envVars = {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
    }

    // Determine the base URL
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!baseUrl && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    } else if (!baseUrl) {
      baseUrl = "http://localhost:3000"
    }

    // Compute important URLs
    const computedUrls = {
      baseUrl,
      loginRedirectUrl: `${baseUrl}/login`,
      callbackUrl: `${baseUrl}/api/auth/callback`,
    }

    // Check if the configuration is valid
    const isProduction = process.env.NODE_ENV === "production"
    const hasCorrectSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.includes("sfdeputysheriff.com")

    const isValid = !isProduction || hasCorrectSiteUrl

    return NextResponse.json({
      isValid,
      environment: process.env.NODE_ENV || "development",
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "Not set",
      envVars,
      computedUrls,
    })
  } catch (error) {
    console.error("Error checking site URL:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
