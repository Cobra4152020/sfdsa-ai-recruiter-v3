import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Get environment variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "Not set"
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: "Missing Supabase configuration",
        environmentVariables: {
          NEXT_PUBLIC_SITE_URL: siteUrl,
          NODE_ENV: process.env.NODE_ENV,
        },
      })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the current URL used by the application
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : siteUrl || "http://localhost:3000"

    // Compute some example URLs to check configuration
    const computedUrls = {
      baseUrl,
      loginRedirectUrl: `${baseUrl}/login`,
      callbackUrl: `${baseUrl}/api/auth/callback`,
    }

    return NextResponse.json({
      success: true,
      environmentVariables: {
        NEXT_PUBLIC_SITE_URL: siteUrl,
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_URL: process.env.VERCEL_URL || "Not set",
      },
      computedUrls,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    })
  }
}
