import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { constructUrl } from "@/lib/url-utils"

export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    const requiredEnvVars = [
      "RESEND_API_KEY",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required environment variables: ${missingVars.join(", ")}`,
        details: {
          missingVars,
          baseUrl,
        },
      })
    }

    // Check Supabase connection
    const supabase = createClient()
    const { error: supabaseError } = await supabase.from("users").select("id").limit(1)

    if (supabaseError) {
      return NextResponse.json({
        success: false,
        message: "Supabase connection error",
        details: {
          error: supabaseError.message,
          baseUrl,
        },
      })
    }

    // Check email configuration
    const resendApiKey = process.env.RESEND_API_KEY
    const isResendConfigured = !!resendApiKey && resendApiKey.startsWith("re_")

    if (!isResendConfigured) {
      return NextResponse.json({
        success: false,
        message: "Resend API key is missing or invalid",
        details: {
          resendConfigured: isResendConfigured,
          baseUrl,
        },
      })
    }

    // All checks passed
    return NextResponse.json({
      success: true,
      message: "All email configurations are valid",
      details: {
        baseUrl,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        resendConfigured: isResendConfigured,
      },
    })
  } catch (error) {
    console.error("Email config diagnostic error:", error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error checking email configuration",
    })
  }
}
