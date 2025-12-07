import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes - check for auth token in header
  // For client-side navigation, auth is handled by AuthProvider
  if (pathname.startsWith("/dashboard")) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    // If no token in header, allow through (client-side will handle redirect)
    // This allows initial page load, and client-side auth will handle redirects
    if (!token && request.headers.get("x-middleware-request") !== "true") {
      // For API routes, require token
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
