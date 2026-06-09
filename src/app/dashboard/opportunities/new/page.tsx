import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewOpportunityPage from '@/features/opportunities/components/NewOpportunityPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'فرصة جديدة — موجود' }

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role, is_verified').eq('id', user.id).single()

  if (!profile || profile.role !== 'org') redirect('/dashboard')

  return <NewOpportunityPage isVerified={profile.is_verified ?? false} />
}
