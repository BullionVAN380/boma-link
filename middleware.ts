import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimit = new Map();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean up old entries
  for (const [key, timestamp] of rateLimit.entries()) {
    if (timestamp < windowStart) {
      rateLimit.delete(key);
    }
  }

  // Count requests in current window
  const requestCount = Array.from(rateLimit.entries())
    .filter(([key, timestamp]) => key.startsWith(ip) && timestamp > windowStart)
    .length;

  // Add current request
  rateLimit.set(`${ip}-${now}`, now);

  return requestCount >= MAX_REQUESTS;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isApiRoute = req.nextUrl.pathname.startsWith('/api');

    // Rate limiting for API routes
    if (isApiRoute) {
      const ip = req.ip || 'unknown';
      if (isRateLimited(ip)) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/properties/create',
    '/properties/edit/:path*',
    '/jobs/create',
    '/jobs/edit/:path*',
    '/profile/:path*',
    '/api/auth/:path*',
    '/api/jobs/:path*',
    '/api/users/:path*',
    '/api/applications/:path*'
  ]
};
