import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Check if path starts with protected routes
    const isVolunteerRoute = req.nextUrl.pathname.startsWith("/volunteer-dashboard")
    const isRecruitRoute = req.nextUrl.pathname.startsWith("/dashboard")
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    if (isVolunteerRoute || isRecruitRoute || isAdminRoute) {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error in middleware:", sessionError)
          throw sessionError
        }

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
        try {
          const { data: userTypeData, error: userTypeError } = await supabase
            .from("user_types")
            .select("user_type")
            .eq("user_id", session.user.id)
            .single()

          if (userTypeError) {
            console.error("User type error in middleware:", userTypeError)
            // Continue with default behavior instead of throwing
          }

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
            try {
              const { data: volunteerData, error: volunteerError } = await supabase
                .from("volunteer.recruiters")
                .select("is_active")
                .eq("id", session.user.id)
                .single()

              if (volunteerError) {
                console.error("Volunteer data error in middleware:", volunteerError)
                // Continue with default behavior instead of throwing
              }

              if (!volunteerData?.is_active) {
                return NextResponse.redirect(new URL("/volunteer-pending", req.url))
              }
            } catch (error) {
              console.error("Error checking volunteer status:", error)
              // Continue with default behavior
            }
          }
        } catch (error) {
          console.error("Error checking user type:", error)
          // Continue with default behavior
        }
      } catch (error) {
        console.error("Auth error in middleware:", error)
        // For auth errors, redirect to login
        if (isVolunteerRoute) {
          return NextResponse.redirect(new URL("/volunteer-login", req.url))
        } else if (isAdminRoute) {
          return NextResponse.redirect(new URL("/admin-login", req.url))
        } else {
          return NextResponse.redirect(new URL("/login", req.url))
        }
      }
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // For critical errors, just continue to the page
    // The page itself should handle auth requirements
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/volunteer-dashboard/:path*", "/admin/:path*", "/((?!admin-login).*)"],
}
