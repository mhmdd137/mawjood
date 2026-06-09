import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfilePage from '@/features/profiles/components/ProfilePage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'الإعدادات — موجود' }

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  if (error || !profile) redirect('/login')

  let avatarSignedUrl: string | null = null
  if (profile.avatar_url) {
    const { data } = await supabase.storage
      .from('avatars').createSignedUrl(profile.avatar_url, 3600)
    avatarSignedUrl = data?.signedUrl ?? null
  }

  return (
  <ProfilePage
        profile={{
          ...profile,
          avatar_url: avatarSignedUrl,
          email: user.email ?? '',
        }}
      />
  )
}