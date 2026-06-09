import { createAdminClient } from '@/lib/supabase/admin-client'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminOrgsPage from '@/features/admin/components/AdminOrgsPage'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const admin = createAdminClient()

  const { data: orgs } = await admin
    .from('profiles')
    .select('id, full_name, bio, is_verified, created_at, avatar_url')
    .eq('role', 'org')
    .order('created_at', { ascending: false })

  const mapped = await Promise.all(
    (orgs ?? []).map(async (org) => {
      const { count } = await admin
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', org.id)

      let avatarUrl: string | null = null
      if (org.avatar_url) {
        const { data: signed } = await admin.storage
          .from('avatars')
          .createSignedUrl(org.avatar_url, 3600)
        avatarUrl = signed?.signedUrl ?? null
      }

      return {
        id: org.id,
        full_name: org.full_name,
        bio: org.bio ?? '',
        is_verified: org.is_verified,
        created_at: org.created_at,
        avatar_url: avatarUrl,
        opportunities_count: count ?? 0,
      }
    })
  )

  return <AdminOrgsPage orgs={mapped} />
}