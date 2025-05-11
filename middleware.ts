import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

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
        return NextResponse.redirect(new URL("/admin/login", req.url))
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
  matcher: ["/dashboard/:path*", "/volunteer-dashboard/:path*", "/admin/:path*", "/((?!admin/login).*)"],
}
