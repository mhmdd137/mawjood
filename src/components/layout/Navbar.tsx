import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'
import Logo from '../ui/Logo'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { full_name: string; role: string } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="horizontal" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-900 transition-colors hover:text-indigo-600">
              الرئيسية
            </Link>
            <Link href="/opportunities" className="text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600">
              الفرص التطوعية
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600">
              عن موجود
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && profile ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-indigo-700 hover:text-indigo-900 transition-colors"
              >
                {profile.full_name}
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  لوحة التحكم
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="hidden sm:flex border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/register">
                <Button>إنشاء حساب</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
