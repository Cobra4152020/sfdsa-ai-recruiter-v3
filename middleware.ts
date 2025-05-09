import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This middleware ensures environment variables are properly loaded
  // and logs diagnostic information in development

  if (process.env.NODE_ENV === "development") {
    // Log environment variable status in development
    console.log("Environment check in middleware:")
    console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Missing"}`)
    console.log(
      `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Available" : "Missing"}`,
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/chat/:path*"],
}
