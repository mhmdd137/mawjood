import { createAdminClient } from '@/lib/supabase/admin-client'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminVolunteersPage from '@/features/admin/components/AdminVolunteersPage'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const admin = createAdminClient()

const { data: volunteers } = await admin
  .from('profiles')
  .select('id, full_name, location, skills, created_at, avatar_url')
  .eq('role', 'volunteer')
  .order('created_at', { ascending: false })

const mapped = await Promise.all(
  (volunteers ?? []).map(async (v) => {
    const { count } = await admin
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('volunteer_id', v.id)

    let avatarUrl: string | null = null
    if (v.avatar_url) {
      const { data: signed } = await admin.storage
        .from('avatars')
        .createSignedUrl(v.avatar_url, 3600)
      avatarUrl = signed?.signedUrl ?? null
    }

    return {
      id: v.id,
      full_name: v.full_name,
      location: v.location,
      skills: v.skills ?? [],
      created_at: v.created_at,
      applications_count: count ?? 0,
      avatar_url: avatarUrl,
    }
  })
)

  return <AdminVolunteersPage volunteers={mapped} />
}