import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import OpportunityDetailPage from '@/features/opportunities/components/OpportunityDetailPage'
import type { ApplicantDetail } from '@/features/opportunities/components/OpportunityDetailPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'إدارة الفرصة — موجود' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'org') redirect('/dashboard')

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('id, title, description, category, location, required_skills, time_slot, start_date, end_date, status, org_id, created_at')
    .eq('id', id)
    .single()

  if (error || !opportunity) notFound()
  if (opportunity.org_id !== user.id) redirect('/dashboard/opportunities')

  const { data: rawApplicants } = await supabase
    .from('applications')
    .select(`
      id, status, applied_at, message,
      volunteer:profiles!volunteer_id(id, full_name, skills, location, avatar_url)
    `)
    .eq('opportunity_id', id)
    .order('applied_at', { ascending: false })

  const applicants = (rawApplicants ?? []) as unknown as ApplicantDetail[]

  return (
    <OpportunityDetailPage
      opportunity={opportunity}
      applicants={applicants}
    />
  )
}