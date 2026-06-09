'use client'

import { Bell, Menu } from 'lucide-react'
import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { markAsRead, markAllAsRead } from '@/features/notifications/actions/notifications.actions'
import { useDashboard } from '@/components/layout/DashboardProvider'

interface TopbarProps {
  title: string
  unreadCount?: number
  avatarUrl?: string | null
  userName?: string
  onMenuClick?: () => void
}

const ROLE_LABELS: Record<string, string> = {
  volunteer: 'متطوع',
  org:       'منظمة',
  admin:     'مدير',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours   = Math.floor(diff / 3600000)
  const days    = Math.floor(diff / 86400000)
  if (minutes < 1)  return 'الآن'
  if (minutes < 60) return `منذ ${minutes} د`
  if (hours < 24)   return `منذ ${hours} س`
  return `منذ ${days} ي`
}

export function Topbar({ title, unreadCount: initialUnread = 0, avatarUrl, userName, onMenuClick }: TopbarProps) {
  const router = useRouter()
  const { profile, notifications: initialNotifs = [] } = useDashboard()

  const [profileOpen, setProfileOpen]   = useState(false)
  const [notifOpen, setNotifOpen]       = useState(false)
  const [unreadCount, setUnreadCount]   = useState(initialUnread)
  const [notifications, setNotifications] = useState(initialNotifs)
  const [, startTransition] = useTransition()

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef   = useRef<HTMLDivElement>(null)

  const initials = userName
    ? userName.trim().split(' ').map((n) => n[0]).join('').slice(0, 2)
    : 'م'

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function handleNotifClick(id: string, href: string, isRead: boolean) {
    if (!isRead) {
      setUnreadCount((c) => Math.max(0, c - 1))
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
      startTransition(async () => { await markAsRead(id) })
    }
    setNotifOpen(false)
    router.push(href)
  }

  function handleMarkAll() {
    setUnreadCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    startTransition(async () => { await markAllAsRead() })
  }

  function getNotifHref(n: { type: string; related_id: string | null }) {
    if (!n.related_id) return '/dashboard/notifications'
    switch (n.type) {
      case 'new_opportunity':    return `/opportunities/${n.related_id}`
      case 'application_accepted':
      case 'application_rejected': return '/dashboard/applications'
      case 'new_application':    return `/dashboard/opportunities/${n.related_id}`
      default: return '/dashboard/notifications'
    }
  }

  return (
    <header
      className="fixed top-0 right-0 lg:right-[220px] left-0 h-[56px] bg-white border-b flex items-center justify-between px-4 lg:px-6 z-30"
      style={{ borderBottomWidth: '0.5px', borderColor: '#E5E5E5' }}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-[15px] font-medium" style={{ color: '#1A1A1A' }}>{title}</h1>
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[#F6F2FA] transition-colors duration-150"
          aria-label="فتح القائمة"
        >
          <Menu size={20} style={{ color: '#474551' }} />
        </button>
      </div>

      <div className="flex items-center gap-3 flex-row-reverse">

        {/* Avatar + profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false) }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-medium cursor-pointer overflow-hidden transition-opacity duration-150 hover:opacity-80"
            style={{ backgroundColor: '#3C3489' }}
            aria-label="قائمة الحساب"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName || ''} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </button>

          {profileOpen && (
            <div
              className="absolute left-0 top-11 w-52 rounded-xl shadow-lg z-50 overflow-hidden"
              style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
              dir="rtl"
            >
              {/* User info */}
              <div className="px-4 py-3" style={{ borderBottom: '0.5px solid #E5E5E5' }}>
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{userName}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  {ROLE_LABELS[profile?.role ?? ''] ?? profile?.role}
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-col py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-gray-50"
                  style={{ color: '#1A1A1A' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="#474551" strokeWidth="1.5"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="#474551" strokeWidth="1.5"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="#474551" strokeWidth="1.5"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="#474551" strokeWidth="1.5"/>
                  </svg>
                  الرئيسية
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-gray-50"
                  style={{ color: '#1A1A1A' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" stroke="#474551" strokeWidth="1.5"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#474551" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  الإعدادات
                </Link>
              </div>

              {/* Sign out */}
              <div style={{ borderTop: '0.5px solid #E5E5E5' }}>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-right transition-colors duration-150 hover:bg-gray-50"
                  style={{ color: '#A32D2D' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#A32D2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bell + notifications dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false) }}
            className="relative p-2 rounded-full transition-colors duration-150 hover:bg-[#F6F2FA]"
            aria-label="الإشعارات"
          >
            <Bell size={18} style={{ color: '#474551' }} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 w-[7px] h-[7px] rounded-full"
                style={{ backgroundColor: '#993C1D' }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute left-0 top-11 w-80 rounded-xl shadow-lg z-50 overflow-hidden"
              style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
              dir="rtl"
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '0.5px solid #E5E5E5' }}>
                <div className="flex items-center gap-2">
                  <Link href="/dashboard/notifications" onClick={() => setNotifOpen(false)} className="text-xs" style={{ color: '#3C3489' }}>
                    عرض الكل
                  </Link>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAll} className="text-xs" style={{ color: '#9CA3AF' }}>
                      · قراءة الكل
                    </button>
                  )}
                </div>
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>الإشعارات</p>
              </div>

              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>لا توجد إشعارات</p>
                </div>
              ) : (
                <div className="flex flex-col max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotifClick(n.id, getNotifHref(n), n.is_read)}
                      className="flex items-start gap-3 px-4 py-3 text-right transition-colors duration-150 hover:bg-gray-50 w-full"
                      style={{ borderBottom: '0.5px solid #F0ECF4', backgroundColor: n.is_read ? 'white' : '#F6F2FA' }}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.is_read ? 'transparent' : '#3C3489' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed text-right" style={{ color: n.is_read ? '#666666' : '#1A1A1A', fontWeight: n.is_read ? 400 : 500 }}>
                          {n.message}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{timeAgo(n.created_at)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  )
}