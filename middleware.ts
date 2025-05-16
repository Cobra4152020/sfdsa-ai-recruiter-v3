import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { mockData } from './app/lib/mock-data'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Emergency bypass for specific paths
  const emergencyPaths = [
    "/emergency-admin-access",
    "/admin/fix-login",
    "/admin/database-schema",
    "/admin/sql-runner",
    "/admin/fix-user-roles",
    "/admin/setup",
    "/admin/health",
    "/admin/deployment",
    "/admin/email-diagnostics",
  ]

  // Check if current path is in the emergency paths list
  const currentPath = req.nextUrl.pathname
  if (emergencyPaths.some((path) => currentPath.startsWith(path))) {
    return res
  }

  // Also bypass if there's a bypass query parameter
  const searchParams = req.nextUrl.searchParams
  if (searchParams.has("emergency_bypass")) {
    return res
  }

  // The rest of the middleware stays the same
  // Create a new supabase client for each request in middleware
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
    try {
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

      // Get user type - but catch errors to prevent 500s
      try {
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
      } catch (error) {
        console.error("Error in middleware user verification:", error)
        // If there's an error checking permissions, still allow access to admin pages
        // to prevent locking out administrators when database issues occur
        if (isAdminRoute) {
          return res
        }
      }
    } catch (error) {
      console.error("Middleware error:", error)
      // For any error in middleware, allow admin access to fix issues
      if (isAdminRoute) {
        return res
      }
    }
  }

  // Handle API routes in static export
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const apiPath = req.nextUrl.pathname.replace('/api/', '')
    
    // Map API paths to mock data
    switch (apiPath) {
      case 'leaderboard':
      case 'leaderboard/':
        return NextResponse.json(mockData.leaderboard)
      
      case 'users':
      case 'users/':
        return NextResponse.json({ users: [] })
      
      case 'trivia/questions':
      case 'trivia/questions/':
        return NextResponse.json({ questions: mockData.triviaQuestions })
      
      case 'badges':
      case 'badges/':
        return NextResponse.json({ badges: mockData.badges })
      
      case 'stats':
      case 'stats/':
        return NextResponse.json(mockData.stats)
      
      case 'notifications':
      case 'notifications/':
        return NextResponse.json({ notifications: mockData.notifications })
      
      default:
        // Return empty success response for other API routes
        return NextResponse.json({ success: true })
    }
  }

  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/volunteer-dashboard/:path*",
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|emergency-admin-access).)*",
  ],
}
