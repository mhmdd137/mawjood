import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CompleteProfileForm from '@/features/auth/components/CompleteProfileForm'

export default async function CompleteProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // لو عنده profile خليه يروح للداشبورد
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (profile) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F6F2FA' }} dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#3C3489' }}>موجود</h1>
          <p className="text-sm mt-2" style={{ color: '#666666' }}>أكمل بياناتك للمتابعة</p>
        </div>
        <div className="bg-white rounded-2xl p-8" style={{ border: '0.5px solid #E5E5E5' }}>
          <CompleteProfileForm />
        </div>
      </div>
    </div>
  )
}