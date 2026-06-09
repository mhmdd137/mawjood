import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CertificatesPage from '@/features/certificates/components/CertificatesPage'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (!profile || profile.role !== 'volunteer') redirect('/dashboard')

  const { data: certificates, error } = await supabase
    .from('certificates')
    .select(`
      id, hours_logged, issue_date, file_path, verification_code, status, issued_at,
      application:applications!application_id(
        opportunity:opportunities!opportunity_id(
          id, title, category,
          org:profiles!org_id(full_name)
        )
      )
    `)
    .eq('volunteer_id', user.id)
    .order('issued_at', { ascending: false })

  if (error) throw new Error(error.message)

  const mapped = (certificates ?? []).map((cert) => {
    const opp = (cert.application as unknown as{
      opportunity: {
        id: string
        title: string
        category: string
        org: { full_name: string } | null
      } | null
    } | null)?.opportunity

    return {
      id: cert.id,
      file_path: cert.file_path,
      hours_logged: cert.hours_logged,
      issue_date: cert.issue_date,
      status: cert.status as 'active' | 'revoked',
      verification_code: cert.verification_code,
      opportunity: {
        title: opp?.title ?? '',
        category: opp?.category ?? '',
      },
      org: {
        full_name: opp?.org?.full_name ?? '',
      },
    }
  })

  return <CertificatesPage certificates={mapped} />
}