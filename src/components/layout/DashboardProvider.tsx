'use client'

import { createContext, useContext } from 'react'
import type { Profile } from '@/types'

interface Notification {
  id: string
  message: string
  is_read: boolean
  type: string
  related_id: string | null
  created_at: string
}

interface DashboardContextValue {
  profile: Profile
  unreadCount: number
  notifications: Notification[]
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}

export function DashboardProvider({
  profile,
  unreadCount,
  notifications,
  children,
}: {
  profile: Profile
  unreadCount: number
  notifications: Notification[]
  children: React.ReactNode
}) {
  return (
    <DashboardContext.Provider value={{ profile, unreadCount, notifications }}>
      {children}
    </DashboardContext.Provider>
  )
}