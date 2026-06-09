import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'تسجيل الدخول — موجود',
  description: 'سجّل دخولك للوصول إلى فرص التطوع في غزة',
}

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return <LoginForm />
}