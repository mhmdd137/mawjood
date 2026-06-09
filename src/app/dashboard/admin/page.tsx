import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { redirect } from 'next/navigation'
import AdminPage from '@/features/admin/components/AdminPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'لوحة التحكم — موجود' }

function getArabicMonth(date: Date): string {
  return date.toLocaleDateString('ar-EG', { month: 'long' })
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const admin = createAdminClient()

  const [
    { count: totalVolunteers },
    { count: totalOrgs },
    { count: totalOpportunities },
    { count: totalApplications },
    { count: totalCertificates },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'volunteer'),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'org'),
    admin.from('opportunities').select('*', { count: 'exact', head: true }),
    admin.from('applications').select('*', { count: 'exact', head: true }),
    admin.from('certificates').select('*', { count: 'exact', head: true }),
  ])

  const { data: pendingOrgs } = await admin
    .from('profiles').select('id, full_name, bio, created_at')
    .eq('role', 'org').eq('is_verified', false)
    .order('created_at', { ascending: false })

  const { data: verifiedOrgs } = await admin
    .from('profiles').select('id, full_name, bio, created_at')
    .eq('role', 'org').eq('is_verified', true)
    .order('created_at', { ascending: false }).limit(10)

  const [{ data: recentOppsRaw }, { data: recentAppsRaw }, { data: recentCertsRaw }] = await Promise.all([
    admin.from('opportunities')
      .select('id, title, status, org:profiles!org_id(full_name)')
      .order('created_at', { ascending: false }).limit(5),
    admin.from('applications')
      .select('id, status, volunteer:profiles!volunteer_id(full_name), opportunity:opportunities!opportunity_id(title)')
      .order('applied_at', { ascending: false }).limit(5),
    admin.from('certificates')
      .select('id, hours_logged, volunteer:profiles!volunteer_id(full_name), application:applications!application_id(opportunity:opportunities!opportunity_id(title))')
      .order('issued_at', { ascending: false }).limit(5),
  ])

  // Growth chart — last 6 months
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 5)
  cutoff.setDate(1); cutoff.setHours(0, 0, 0, 0)

  const [{ data: vRows }, { data: oRows }] = await Promise.all([
    admin.from('profiles').select('created_at').eq('role', 'volunteer').gte('created_at', cutoff.toISOString()),
    admin.from('opportunities').select('created_at').gte('created_at', cutoff.toISOString()),
  ])

  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
    return { year: d.getFullYear(), month: d.getMonth(), label: getArabicMonth(d) }
  })

  const growthData = buckets.map(({ year, month, label }) => ({
    month: label,
    volunteers: vRows?.filter(v => { const d = new Date(v.created_at); return d.getFullYear() === year && d.getMonth() === month }).length ?? 0,
    opportunities: oRows?.filter(o => { const d = new Date(o.created_at); return d.getFullYear() === year && d.getMonth() === month }).length ?? 0,
  }))

  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    <AdminPage
      stats={{ totalVolunteers: totalVolunteers ?? 0, totalOrgs: totalOrgs ?? 0, totalOpportunities: totalOpportunities ?? 0, totalApplications: totalApplications ?? 0, totalCertificates: totalCertificates ?? 0 }}
      pendingOrgs={(pendingOrgs ?? []) as any[]}
      verifiedOrgs={(verifiedOrgs ?? []) as any[]}
      recentOpportunities={(recentOppsRaw ?? []).map((o: any) => ({ id: o.id, title: o.title, org_name: o.org?.full_name ?? '—', status: o.status }))}
      recentApplications={(recentAppsRaw ?? []).map((a: any) => ({ id: a.id, volunteer_name: a.volunteer?.full_name ?? '—', opportunity_title: a.opportunity?.title ?? '—', status: a.status }))}
      recentCertificates={(recentCertsRaw ?? []).map((c: any) => ({ id: c.id, volunteer_name: c.volunteer?.full_name ?? '—', opportunity_title: c.application?.opportunity?.title ?? '—', hours_logged: c.hours_logged }))}
      growthData={growthData}
    />
  )
}