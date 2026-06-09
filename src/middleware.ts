import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// الروتات اللي تحتاج تحقق من الـ role
const ADMIN_ONLY_ROUTES = ['/dashboard/admin']
const NON_ADMIN_ROUTES = [
  '/dashboard/applications',
  '/dashboard/certificates',
  '/dashboard/opportunities',
]

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const redirectWithCookies = (url: URL) => {
    const response = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, cookie)
    })
    return response
  }

  // لو مسجل ويحاول يوصل لـ login/register → داشبورد
  if (user && (pathname === '/login' || pathname === '/register')) {
    return redirectWithCookies(new URL('/dashboard', request.url))
  }

  // لو مش مسجل ويحاول يوصل لـ dashboard → login
  if (!user && pathname.startsWith('/dashboard')) {
    return redirectWithCookies(new URL('/login', request.url))
  }

  // تحقق من الـ role — query واحدة تكفي للحالتين
  const needsRoleCheck =
    user &&
    (ADMIN_ONLY_ROUTES.some(r => pathname.startsWith(r)) ||
      NON_ADMIN_ROUTES.some(r => pathname.startsWith(r)))

  if (needsRoleCheck) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // روتات الأدمن فقط — غير الأدمن يرجع للداشبورد
    if (
      ADMIN_ONLY_ROUTES.some(r => pathname.startsWith(r)) &&
      profile?.role !== 'admin'
    ) {
      return redirectWithCookies(new URL('/dashboard', request.url))
    }

    // روتات المتطوع/المنظمة — الأدمن يرجع للداشبورد
    if (
      NON_ADMIN_ROUTES.some(r => pathname.startsWith(r)) &&
      profile?.role === 'admin'
    ) {
      return redirectWithCookies(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}