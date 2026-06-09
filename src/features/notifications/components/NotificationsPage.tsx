'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { markAsRead, markAllAsRead } from '@/features/notifications/actions/notifications.actions'
import type { Notification } from '@/types'

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : minutes === 2 ? 'دقيقتين' : 'دقائق'}`
  if (hours < 24) return `منذ ${hours} ${hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتين' : 'ساعات'}`
  if (days < 7) return `منذ ${days} ${days === 1 ? 'يوم' : days === 2 ? 'يومين' : 'أيام'}`
  return new Date(dateStr).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })
}

function getRelatedHref(n: Notification): string {
  if (!n.related_id) return '/dashboard'
  switch (n.type) {
    case 'new_opportunity':     return `/opportunities/${n.related_id}`
    case 'application_accepted':
    case 'application_rejected': return '/dashboard/applications'
    case 'certificate_issued':  return '/dashboard/certificates' // ✅ جديد
    case 'new_application':     return `/dashboard/opportunities/${n.related_id}`
    case 'org_verified':        return '/dashboard'
    default:                    return '/dashboard'
  }
}

type NotificationType = Notification['type']

function NotificationIcon({ type }: { type: NotificationType }) {
  const configs: Record<NotificationType, { bg: string; icon: React.ReactNode }> = {
    application_accepted: { bg: '#E1F5EE', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12l4 4L19 8" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    application_rejected: { bg: '#FCEBEB', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" /></svg> },
    new_opportunity: { bg: '#EEEDFE', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="#3C3489" strokeWidth="1.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round" /></svg> },
    new_application: { bg: '#EEEDFE', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="#3C3489" strokeWidth="1.5" /></svg> },
    org_verified: { bg: '#E1F5EE', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2l3 6.5L22 9.5l-5 5 1.2 7L12 18l-6.2 3.5L7 14.5 2 9.5l7-1L12 2z" stroke="#0F6E56" strokeWidth="1.5" strokeLinejoin="round" /></svg> },
    certificate_issued: {
    bg: '#EEEDFE',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
          stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  }
  const { bg, icon } = configs[type]
  return <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>{icon}</div>
}

function NotificationItem({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) {
  const router = useRouter()
  function handleClick() {
    if (!notification.is_read) onRead(notification.id)
    router.push(getRelatedHref(notification))
  }
  return (
    <div
      className="flex items-start gap-4 px-5 py-4 rounded-xl cursor-pointer transition-colors duration-150"
      style={{ backgroundColor: notification.is_read ? 'white' : '#F6F2FA', border: '0.5px solid #E5E5E5' }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={notification.is_read ? notification.message : `إشعار غير مقروء: ${notification.message}`}
    >
      <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
        <div className="w-2 h-2 rounded-full transition-colors duration-150" style={{ backgroundColor: notification.is_read ? 'transparent' : '#3C3489' }} aria-hidden="true" />
      </div>
      <NotificationIcon type={notification.type} />
      <div className="flex-1 text-right min-w-0">
        <p className="text-sm leading-relaxed" style={{ color: notification.is_read ? '#666666' : '#1A1A1A', fontWeight: notification.is_read ? 400 : 500 }}>
          {notification.message}
        </p>
        <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{formatTimeAgo(notification.created_at)}</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-xl text-center" style={{ border: '0.5px dashed #E5E5E5' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-4" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#C8C4D3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="1" y1="1" x2="23" y2="23" stroke="#C8C4D3" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="text-sm font-medium" style={{ color: '#474551' }}>لا توجد إشعارات</p>
      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>سيتم إعلامك فور وجود تحديثات جديدة.</p>
    </div>
  )
}

export default function NotificationsPage({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [, startTransition] = useTransition()

  const unreadCount = notifications.filter((n) => !n.is_read).length

  function handleMarkAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    startTransition(async () => { await markAsRead(id) })
  }

  function handleMarkAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    startTransition(async () => { await markAllAsRead() })
  }

  const unread = notifications.filter((n) => !n.is_read)
  const read = notifications.filter((n) => n.is_read)

  return (
    <DashboardLayout title="الإشعارات">
      <div className="max-w-2xl mx-auto" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <h1 className="text-lg font-medium" style={{ color: '#1A1A1A' }}>الإشعارات</h1>
            {unreadCount > 0 && (
              <p className="text-sm mt-0.5" style={{ color: '#666666' }}>
                {unreadCount === 1 ? 'إشعار واحد غير مقروء' : unreadCount === 2 ? 'إشعاران غير مقروءان' : `${unreadCount} إشعارات غير مقروءة`}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-sm font-medium rounded-lg px-4 py-2 transition-colors duration-150" style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5', color: '#3C3489' }}>
              قراءة الكل
            </button>
          )}
        </div>

        {unread.length > 0 && (
          <section className="mb-6" aria-label="الإشعارات غير المقروءة">
            <div className="flex flex-col gap-2">
              {unread.map((n) => <NotificationItem key={n.id} notification={n} onRead={handleMarkAsRead} />)}
            </div>
          </section>
        )}

        {read.length > 0 && (
          <section aria-label="الإشعارات المقروءة">
            {unread.length > 0 && <p className="text-xs mb-3 text-right" style={{ color: '#9CA3AF' }}>سابقاً</p>}
            <div className="flex flex-col gap-2">
              {read.map((n) => <NotificationItem key={n.id} notification={n} onRead={handleMarkAsRead} />)}
            </div>
          </section>
        )}

        {notifications.length === 0 && <EmptyState />}
      </div>
    </DashboardLayout>
  )
}