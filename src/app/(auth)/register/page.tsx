import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RegisterForm from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'إنشاء حساب — موجود',
  description: 'انضم إلى منصة موجود وابدأ رحلتك التطوعية في غزة',
}

export default async function RegisterPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return <RegisterForm />
}