'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const orgIdSchema = z.object({ org_id: z.string().uuid('معرّف غير صالح') })

async function ensureAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')
  return { supabase, adminClient: createAdminClient() }
}

export async function approveOrganization(
  orgId: string
): Promise<{ error: string | null }> {
  const parsed = orgIdSchema.safeParse({ org_id: orgId })
  if (!parsed.success) return { error: 'معرّف المنظمة غير صالح' }

  const { adminClient } = await ensureAdmin()

  const { error } = await adminClient
    .from('profiles')
    .update({ is_verified: true })
    .eq('id', orgId)

  if (error) return { error: error.message }

  await adminClient.from('notifications').insert({
    user_id: orgId,
    type: 'org_verified',
    message: 'تم التحقق من منظمتك بنجاح. يمكنك الآن نشر الفرص التطوعية.',
    is_read: false,
    related_id: null,
  })

  revalidatePath('/dashboard/admin')
  return { error: null }
}

export async function rejectOrganization(
  orgId: string
): Promise<{ error: string | null }> {
  const parsed = orgIdSchema.safeParse({ org_id: orgId })
  if (!parsed.success) return { error: 'معرّف المنظمة غير صالح' }

  const { adminClient } = await ensureAdmin()

  const { error } = await adminClient
    .from('profiles')
    .delete()
    .eq('id', orgId)

  if (error) return { error: 'لا يمكن حذف المنظمة — يوجد بيانات مرتبطة بها' }

  revalidatePath('/dashboard/admin')
  return { error: null }
}

export async function revokeOrganization(
  orgId: string
): Promise<{ error: string | null }> {
  const parsed = orgIdSchema.safeParse({ org_id: orgId })
  if (!parsed.success) return { error: 'معرّف المنظمة غير صالح' }

  const { adminClient } = await ensureAdmin()

  const { error } = await adminClient
    .from('profiles')
    .update({ is_verified: false })
    .eq('id', orgId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin')
  return { error: null }
}
