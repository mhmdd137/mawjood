'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-client'
import { redirect } from 'next/navigation'
import type { Profile, Notification } from '@/types'

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return { user, profile: profile as Profile }
}

export async function requireAuth() {
  const result = await getCurrentUser()
  if (!result) redirect('/login')
  return result
}

export async function requireRole(role: Profile['role']) {
  const result = await requireAuth()
  if (result.profile.role !== role) redirect('/dashboard')
  return result
}

// ─── Notification Helper ──────────────────────────────────────────────────────

interface SendNotificationParams {
  userId: string
  type: Notification['type']
  message: string
  relatedId?: string | null
}

export async function sendNotification({
  userId,
  type,
  message,
  relatedId = null,
}: SendNotificationParams) {
  const adminClient = createAdminClient()

  const { error } = await adminClient.from('notifications').insert({
    user_id: userId,
    type,
    message,
    is_read: false,
    related_id: relatedId,
  })

  if (error) {
    console.error('Failed to send notification:', error.message)
  }
}
