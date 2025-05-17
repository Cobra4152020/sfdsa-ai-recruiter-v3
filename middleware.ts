import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Skip database-dependent API routes during static build
  if (process.env.NEXT_PUBLIC_STATIC_BUILD === 'true' && request.nextUrl.pathname.startsWith('/api/')) {
    // For API routes during static build, return an empty 200 response
    return new NextResponse(
      JSON.stringify({ 
        message: 'API routes are disabled in static builds',
        isStaticBuild: true
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  // Continue normal processing for runtime requests
  return NextResponse.next()
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Skip all internal paths (_next, static, etc)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
} 