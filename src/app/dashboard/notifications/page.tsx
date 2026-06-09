import { createClient } from '@/lib/supabase/server'
import NotificationsPage from '@/features/notifications/components/NotificationsPage'
import type { Notification } from '@/types'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('فشل في جلب الإشعارات')
  }

  return <NotificationsPage initialNotifications={notifications as Notification[]} />
}