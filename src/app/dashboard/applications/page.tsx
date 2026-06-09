import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VolunteerApplicationsPage from '@/features/applications/components/VolunteerApplicationsPage'
import OrgApplicationsPage from '@/features/applications/components/OrgApplicationsPage'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile) redirect('/login')

  if (profile.role === 'org') {
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        id, status, applied_at, message,
        volunteer:profiles!volunteer_id(id, full_name, skills, location, avatar_url),
        opportunity:opportunities!opportunity_id(id, title, status)
      `)
      .order('applied_at', { ascending: false })

    if (error) throw new Error(error.message)

    type GroupMap = Record<string, {
      id: string
      title: string
      status: string
      applicants: unknown[]
    }>

    const grouped = (applications ?? []).reduce<GroupMap>((acc, app) => {
      const opp = app.opportunity as unknown as { id: string; title: string; status: string } | null
      if (!opp) return acc
      if (!acc[opp.id]) {
        acc[opp.id] = { id: opp.id, title: opp.title, status: opp.status, applicants: [] }
      }
      acc[opp.id].applicants.push(app)
      return acc
    }, {})

    return <OrgApplicationsPage groups={Object.values(grouped) as Parameters<typeof OrgApplicationsPage>[0]['groups']} />
  }

  // Volunteer view
  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      id, status, applied_at,
      opportunity:opportunities!opportunity_id(
        id, title, category,
        org:profiles!org_id(id, full_name)
      )
    `)
    .eq('volunteer_id', user.id)
    .order('applied_at', { ascending: false })

  if (error) throw new Error(error.message)

  // Map to match VolunteerApplicationsPage types
  const mapped = (applications ?? []).map((app) => {
    const opp = app.opportunity as unknown as {
      id: string
      title: string
      category: string
      org: { id: string; full_name: string } | null
    } | null

    return {
      id: app.id,
      status: app.status as 'pending' | 'accepted' | 'rejected',
      applied_at: app.applied_at,
      opportunity: {
        id: opp?.id ?? '',
        title: opp?.title ?? '',
        category: opp?.category ?? '',
      },
      org: {
        id: opp?.org?.id ?? '',
        full_name: opp?.org?.full_name ?? '',
      },
    }
  })

  return <VolunteerApplicationsPage applications={mapped} />
}