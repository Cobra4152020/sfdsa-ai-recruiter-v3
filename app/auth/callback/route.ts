import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/unified-auth-service"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  // Get the code and provider from the URL
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const provider = searchParams.get("provider") || "unknown"

  // If there's no code, redirect to login
  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Handle the social auth callback
    const result = await authService.handleSocialAuthCallback(code, provider)

    if (!result.success) {
      // If there was an error, redirect to login with error
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(result.message)}`, request.url))
    }

    // If this is a new user, show a welcome message
    if (result.isNewUser) {
      // Set a cookie to show welcome message
      cookies().set("showWelcome", "true", { maxAge: 60 * 5 }) // 5 minutes
    }

    // Redirect to the appropriate dashboard
    return NextResponse.redirect(new URL(result.redirectUrl || "/dashboard", request.url))
  } catch (error) {
    console.error("Social auth callback error:", error)

    // Redirect to login with generic error
    return NextResponse.redirect(new URL("/login?error=Authentication%20failed", request.url))
  }
}
