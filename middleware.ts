import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register')

    // Better Auth can use different cookie names depending on configuration
    // Check for common Better Auth cookie names
    const sessionToken = request.cookies.get('better-auth.session_token') ||
        request.cookies.get('better_auth_session') ||
        request.cookies.get('session')

    const isLoggedIn = !!sessionToken

    // Redirect logged-in users away from auth pages
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Redirect non-logged-in users to login
    if (!isAuthPage && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
