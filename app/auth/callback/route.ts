import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getServiceSupabase } from '@/app/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const requestParams = requestUrl.searchParams
  const code = requestParams.get("code")
  const userType = requestParams.get("userType") || "recruit"
  const callbackUrl = requestParams.get("callbackUrl")
  const error = requestParams.get("error")
  const errorDescription = requestParams.get("error_description")

  // If there's an error from Supabase OAuth
  if (error) {
    console.error("OAuth error:", error, errorDescription)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || "")}`, requestUrl.origin)
    )
  }

  // Determine redirect URL based on user type
  let redirectTo = "/"
  if (userType === "volunteer") {
    redirectTo = "/volunteer-dashboard"
  } else if (userType === "admin") {
    redirectTo = "/admin/dashboard"
  } else {
    redirectTo = "/dashboard"
  }

  // Use callback URL if provided
  if (callbackUrl) {
    // Validate the callback URL is from our domain
    try {
      const callbackUrlObj = new URL(callbackUrl)
      if (callbackUrlObj.origin === requestUrl.origin) {
        redirectTo = callbackUrl
      }
    } catch (e) {
      console.error("Invalid callback URL:", callbackUrl)
    }
  }

  if (code) {
    try {
      // Create a Supabase client for this API route
      const supabase = createRouteHandlerClient({ cookies })
      
      // Exchange code for session
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        throw sessionError
      }

      if (!data.session) {
        throw new Error("No session returned from code exchange")
      }

      // Get service client for admin operations
      const serviceClient = getServiceSupabase()

      // Get user type from user_types table
      const { data: userTypeData, error: userTypeError } = await serviceClient
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.session.user.id)
        .single()

      if (userTypeError) {
        console.error("Error fetching user type:", userTypeError)
      }

      // Get user profile data based on user type
      let userData
      let profileError

      if (userTypeData?.user_type === "volunteer") {
        const result = await serviceClient
          .from("volunteer.recruiters")
          .select("*")
          .eq("id", data.session.user.id)
          .single()
        userData = result.data
        profileError = result.error
      } else if (userTypeData?.user_type === "admin") {
        const result = await serviceClient
          .from("admin.users")
          .select("*")
          .eq("id", data.session.user.id)
          .single()
        userData = result.data
        profileError = result.error
      } else {
        // Default to recruit
        const result = await serviceClient
          .from("recruit.users")
          .select("*")
          .eq("id", data.session.user.id)
          .single()
        userData = result.data
        profileError = result.error
      }

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
      }

      // Update last login timestamp in the appropriate table
      const tableName = userTypeData?.user_type === "volunteer" 
        ? "volunteer.recruiters" 
        : userTypeData?.user_type === "admin" 
          ? "admin.users" 
          : "recruit.users"

      await serviceClient
        .from(tableName)
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.session.user.id)
        .single()

      // Check if volunteer is active
      if (userTypeData?.user_type === "volunteer") {
        const { data: volunteerData } = await serviceClient
          .from("volunteer.recruiters")
          .select("is_active")
          .eq("id", data.session.user.id)
          .single()

        if (!volunteerData?.is_active) {
          return NextResponse.redirect(new URL("/volunteer-pending", requestUrl.origin))
        }
      }

      // Redirect to the appropriate page
      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      const url = new URL("/login", requestUrl.origin)
      url.searchParams.set("error", "auth_error")
      url.searchParams.set("error_description", error instanceof Error ? error.message : "Failed to authenticate")
      return NextResponse.redirect(url)
    }
  }

  // If no code is present, redirect to login page
  return NextResponse.redirect(new URL("/login", requestUrl.origin))
} 