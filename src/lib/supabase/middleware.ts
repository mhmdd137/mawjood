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
      // تحديث طلب المستخدم لضمان أنgetUser() في الصفحات ستقرأ الكوكيز الجديدة
      cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
      
      // تحديث الاستجابة لإرسال الكوكيز للمتصفح
      supabaseResponse = NextResponse.next({
        request,
      })
      
      cookiesToSet.forEach(({ name, value, options }) =>
        supabaseResponse.cookies.set(name, value, options) // تأكد من تمرير options هنا
      )
    },
  },
}
  )

  // This is the important part: it forces session refresh to avoid random logouts
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const publicRoutes = ['/', '/opportunities', '/login', '/register', '/verify', '/profile', '/api']
  const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  
  if (pathname === '/') {
    return supabaseResponse
  }

  // Redirect logic
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && pathname.startsWith('/dashboard/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
