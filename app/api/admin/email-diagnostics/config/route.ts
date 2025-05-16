import { NextResponse } from "next/server"
import { getServiceSupabase } from "@/lib/supabase-clients"
import { constructUrl } from "@/lib/url-utils"

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const requiredEnvVars = [
      "RESEND_API_KEY",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]

    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required environment variables: ${missingVars.join(", ")}`,
        details: {
          missingVars,
          baseUrl: constructUrl(),
        },
      })
    }

    // Check Supabase connection
    const supabase = getServiceSupabase()
    const { error: supabaseError } = await supabase.from("users").select("id").limit(1)

    if (supabaseError) {
      return NextResponse.json({
        success: false,
        message: "Supabase connection error",
        details: {
          error: supabaseError.message,
          baseUrl: constructUrl(),
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
          baseUrl: constructUrl(),
        },
      })
    }

    // All checks passed
    return NextResponse.json({
      success: true,
      message: "All email configurations are valid",
      details: {
        baseUrl: constructUrl(),
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
