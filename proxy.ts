import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Always allow auth API routes through
  if (pathname.startsWith("/api/auth")) return NextResponse.next()

  // Redirect logged-in users away from /login
  if (pathname === "/login") {
    if (isLoggedIn) return NextResponse.redirect(new URL("/", req.nextUrl))
    return NextResponse.next()
  }

  // Protect everything else
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // Run on all routes except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
