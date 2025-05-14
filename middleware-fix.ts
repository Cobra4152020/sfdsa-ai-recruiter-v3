import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Skip auth check for emergency admin fix page
  if (req.nextUrl.pathname.startsWith("/emergency-admin-fix")) {
    return res
  }

  // Create a new supabase client for each request in middleware
  // This avoids the multiple client instances issue
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })

  // Check if path starts with protected routes
  const isVolunteerRoute = req.nextUrl.pathname.startsWith("/volunteer-dashboard")
  const isRecruitRoute = req.nextUrl.pathname.startsWith("/dashboard")
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  if (isVolunteerRoute || isRecruitRoute || isAdminRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      // Redirect to appropriate login page
      if (isVolunteerRoute) {
        return NextResponse.redirect(new URL("/volunteer-login", req.url))
      } else if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin-login", req.url))
      } else {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    // Get user type
    const { data: userTypeData } = await supabase
      .from("user_types")
      .select("user_type")
      .eq("user_id", session.user.id)
      .single()

    const userType = userTypeData?.user_type

    // Check if user has appropriate access
    if (isVolunteerRoute && userType !== "volunteer") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (isRecruitRoute && userType !== "recruit") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (isAdminRoute && userType !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // For volunteer routes, check if account is active
    if (isVolunteerRoute) {
      const { data: volunteerData } = await supabase
        .from("volunteer.recruiters")
        .select("is_active")
        .eq("id", session.user.id)
        .single()

      if (!volunteerData?.is_active) {
        return NextResponse.redirect(new URL("/volunteer-pending", req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/volunteer-dashboard/:path*", "/admin/:path*", "/((?!admin-login).*)"],
}
