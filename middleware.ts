import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/app/api/auth/authOptions';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: authOptions.secret
  });

  // Define protected paths that require authentication
  const protectedPaths = [
    '/properties/create',
    '/jobs/create',
    '/profile',
    '/messages',
    '/admin/dashboard'
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    // Create the returnUrl parameter
    const encodedReturnUrl = encodeURIComponent(request.nextUrl.pathname);
    const signInUrl = new URL(`/auth/signin?returnUrl=${encodedReturnUrl}`, request.url);
    
    return NextResponse.redirect(signInUrl);
  }

  // If user is already logged in and trying to access auth pages, redirect to home
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/properties/create', request.url));
  }

  return NextResponse.next();
}
