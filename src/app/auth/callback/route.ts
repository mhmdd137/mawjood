import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
  }

  const cookieStore = await cookies()

  // ─── THE FIX ───────────────────────────────────────────────────────────────
  // We capture every cookie Supabase tries to set during exchangeCodeForSession
  // in this array, then manually attach them to the redirect response.
  //
  // Why: `NextResponse.redirect()` is a completely separate Response object
  // from the implicit "default" response that `cookies().set()` writes to.
  // Using `createClient()` from server.ts means Supabase writes session cookies
  // to the cookie store, but those cookies are NEVER attached to our redirect —
  // so the browser never sees them and the session appears to be lost.
  // ──────────────────────────────────────────────────────────────────────────
  const capturedCookies: Array<{
    name: string
    value: string
    options: Parameters<typeof cookieStore.set>[2]
  }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 1. Write to the cookie store (for any subsequent reads in this handler)
            cookieStore.set(name, value, options)
            // 2. Capture for our redirect response
            capturedCookies.push({ name, value, options })
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
  }

  // Determine where to redirect the user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  let targetUrl: string
  if (!profile) {
    targetUrl = `${origin}/register/complete`
  } else if (!isLocalEnv && forwardedHost) {
    targetUrl = `https://${forwardedHost}/dashboard`
  } else {
    targetUrl = `${origin}/dashboard`
  }

  // Build the redirect response and attach all captured session cookies to it
  const response = NextResponse.redirect(targetUrl)

  capturedCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
  })

  return response
}