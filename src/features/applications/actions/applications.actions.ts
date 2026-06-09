'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { applicationActionSchema } from '@/lib/validations'

export async function updateApplicationStatus(
  applicationId: string,
  status: 'accepted' | 'rejected'
): Promise<{ error: string | null }> {
  const parsed = applicationActionSchema.safeParse({
    application_id: applicationId,
    action: status,
  })
  if (!parsed.success) return { error: 'بيانات غير صالحة' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify org owns the opportunity
  const { data: application } = await supabase
    .from('applications')
    .select('id, volunteer_id, opportunity_id, opportunities!inner(org_id)')
    .eq('id', applicationId)
    .single()

  if (!application) return { error: 'التقديم غير موجود' }

  const opp = application.opportunities as unknown as { org_id: string }
  if (opp.org_id !== user.id) return { error: 'غير مصرح' }

  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)

  if (error) return { error: error.message }

  // Send notification to volunteer
  const adminClient = createAdminClient()
  const notificationType = status === 'accepted' ? 'application_accepted' : 'application_rejected'
  const notificationMessage =
    status === 'accepted'
      ? 'تم قبول تقديمك على إحدى الفرص. بانتظار انضمامك للفريق الميداني.'
      : 'للأسف تم رفض تقديمك. يمكنك التقديم على فرص أخرى.'

  await adminClient.from('notifications').insert({
    user_id: application.volunteer_id,
    type: notificationType,
    message: notificationMessage,
    is_read: false,
    related_id: application.opportunity_id,
  })

  revalidatePath('/dashboard/applications')
  revalidatePath(`/dashboard/opportunities/${application.opportunity_id}`)
  return { error: null }
}

export async function createApplication(
  opportunityId: string,
  message: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'يجب تسجيل الدخول أولاً' }

  // تحقق إنه متطوع
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'volunteer') return { error: 'متاح للمتطوعين فقط' }

  // تحقق ما قدّم مسبقاً
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('volunteer_id', user.id)
    .eq('opportunity_id', opportunityId)
    .single()

  if (existing) return { error: 'قدّمت على هذه الفرصة مسبقاً' }

  const { error } = await supabase
    .from('applications')
    .insert({
      volunteer_id: user.id,
      opportunity_id: opportunityId,
      message,
      status: 'pending',
    })

  if (error) return { error: error.message }

  revalidatePath(`/opportunities/${opportunityId}`)
  revalidatePath('/dashboard/applications')
  return { error: null }
}
