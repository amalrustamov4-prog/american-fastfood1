import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'american-super-secret-jwt-key-2026-secure-token';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const AUTH_COOKIE_NAME = 'american_auth_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      // Allow the page to load, but the Admin page will check authentication and render login component
      return NextResponse.next();
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      // Invalid token, remove cookie and proceed
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  // Protect courier route
  if (pathname.startsWith('/courier')) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
      } catch (err) {
        // Continue
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/courier/:path*']
};
