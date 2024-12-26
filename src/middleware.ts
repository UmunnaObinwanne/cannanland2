import { createClient } from "@/lib/supabase/server";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
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

  // Protect share routes
  if (
    request.nextUrl.pathname.startsWith('/share-prayer-request') ||
    request.nextUrl.pathname.startsWith('/share-bible-study') ||
    request.nextUrl.pathname.startsWith('/share-testimony') ||
    request.nextUrl.pathname.startsWith('/share-spiritual-question')
  ) {
    if (!session) {
      // Store the original URL they were trying to visit
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Continue with existing admin protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname.match(/\/[^\/]+\/[^\/]+\/edit/)) {
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/share-prayer-request',
    '/share-bible-study',
    '/share-testimony',
    '/share-spiritual-question',
    '/:type/:slug/edit'
  ],
} 