import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes based on role (Example logic)
  if (user) {
    const role = user.app_metadata?.role

    // Admin portal protection
    if (request.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    // Dentist portal protection
    if (request.nextUrl.pathname.startsWith('/dentist') && role !== 'DENTIST' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    // Patient portal protection
    if (request.nextUrl.pathname.startsWith('/patient') && role !== 'PATIENT' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  } else {
    // If user is not logged in and tries to access protected routes
    if (
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/dentist') ||
      request.nextUrl.pathname.startsWith('/patient')
    ) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}
