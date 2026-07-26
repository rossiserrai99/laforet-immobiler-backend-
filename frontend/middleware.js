import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('laforet_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (pathname === '/admin/login' && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
