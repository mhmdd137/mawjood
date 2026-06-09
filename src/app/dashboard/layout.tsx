import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardProvider } from '@/components/layout/DashboardProvider'
import type { Profile } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const [{ count }, { data: notifications }] = await Promise.all([
    supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false),
    supabase
      .from('notifications')
      .select('id, message, is_read, type, related_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  // Signed URL للأفاتار
  let avatarSignedUrl: string | null = null
  if (profile.avatar_url) {
    const { data: signedData } = await supabase.storage
      .from('avatars')
      .createSignedUrl(profile.avatar_url, 3600)
    avatarSignedUrl = signedData?.signedUrl ?? null
  }

  const profileWithSignedUrl: Profile = {
    ...profile,
    avatar_url: avatarSignedUrl,
  }

  return (
    <DashboardProvider
      profile={profileWithSignedUrl}
      unreadCount={count ?? 0}
      notifications={notifications ?? []}
    >
      {children}
    </DashboardProvider>
  )
}