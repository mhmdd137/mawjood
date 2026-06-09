import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrgOpportunitiesPage from '@/features/opportunities/components/OrgOpportunitiesPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'فرصي — موجود' }

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile || profile.role !== 'org') redirect('/dashboard')

  const { data: opportunities, error } = await supabase
    .from('opportunities')
    .select(`
      id, title, status, start_date, end_date, created_at,
      applications(count)
    `)
    .eq('org_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const mapped = (opportunities ?? []).map((o) => ({
    id: o.id,
    title: o.title,
    status: o.status as 'draft' | 'open' | 'closed' | 'completed',
    start_date: o.start_date,
    end_date: o.end_date,
    created_at: o.created_at,
    application_count: (o.applications as unknown as { count: number }[])?.[0]?.count ?? 0,
  }))

  return <OrgOpportunitiesPage opportunities={mapped} />
}
