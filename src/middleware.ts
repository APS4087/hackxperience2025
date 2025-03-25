import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /admin/login,
  // redirect the user to /admin/login
  if (!session && request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const redirectUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access login page, redirect to admin dashboard
  if (session && request.nextUrl.pathname.startsWith('/admin/login')) {
    const redirectUrl = new URL('/admin', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
} 