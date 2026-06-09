import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import VolunteerProfile from '@/features/profiles/components/VolunteerProfile'
import OrgProfile from '@/features/profiles/components/OrgProfile'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, bio, location, skills, time_slot, avatar_url, is_verified, created_at')
    .eq('id', id)
    .single()

  if (error || !profile) notFound()

  // Generate signed URL for avatar if exists
  let avatarSignedUrl: string | null = null
  if (profile.avatar_url) {
    const { data: signed } = await supabase.storage
      .from('avatars')
      .createSignedUrl(profile.avatar_url, 3600)
    avatarSignedUrl = signed?.signedUrl ?? null
  }

  const profileWithAvatar = { ...profile, avatar_url: avatarSignedUrl }

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: '#FCFAFF' }}>
      <main className="mx-auto max-w-[800px] px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: '#666666' }}>
          <Link href="/" className="hover:underline">الرئيسية</Link>
          <span>←</span>
          <span style={{ color: '#1A1A1A' }}>{profile.full_name}</span>
        </div>

        {profile.role === 'volunteer' && (
          <VolunteerProfile profile={profileWithAvatar} />
        )}

        {profile.role === 'org' && (
          <OrgProfile profile={profileWithAvatar} />
        )}

        {profile.role === 'admin' && notFound()}

      </main>
    </div>
  )
}