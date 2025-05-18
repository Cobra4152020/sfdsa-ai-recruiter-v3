import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const userType = requestUrl.searchParams.get("userType") || "recruit"
  const callbackUrl = requestUrl.searchParams.get("callbackUrl")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // If there's an error from Supabase OAuth
  if (error) {
    console.error("OAuth error:", error, errorDescription)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || "")}`, requestUrl.origin)
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
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      // Exchange code for session
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        throw sessionError
      }

      if (!data.session) {
        throw new Error("No session returned from code exchange")
      }

      // Get user type from user_types table
      const { data: userTypeData, error: userTypeError } = await supabase
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
        const result = await supabase
          .from("volunteer.recruiters")
          .select("*")
          .eq("id", data.session.user.id)
          .single()
        userData = result.data
        profileError = result.error
      } else if (userTypeData?.user_type === "admin") {
        const result = await supabase
          .from("admin.users")
          .select("*")
          .eq("id", data.session.user.id)
          .single()
        userData = result.data
        profileError = result.error
      } else {
        // Default to recruit
        const result = await supabase
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

      await supabase
        .from(tableName)
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.session.user.id)
        .single()

    } catch (error) {
      console.error("Error exchanging code for session:", error)
      const url = new URL(redirectTo, requestUrl.origin)
      url.searchParams.set("error", "auth_error")
      url.searchParams.set("error_description", error instanceof Error ? error.message : "Failed to authenticate")
      return NextResponse.redirect(url)
    }
  }

  // Redirect to the appropriate page
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
} 