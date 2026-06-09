'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { useDashboard } from '@/components/layout/DashboardProvider'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  role?: string   // ← هاد بس اللي تغيّر — مقبولة بس مش مستخدمة
}

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const { profile, unreadCount } = useDashboard()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F6F2FA]" dir="rtl">
      <Sidebar
        role={profile.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Topbar
        title={title}
        unreadCount={unreadCount}
        avatarUrl={profile.avatar_url}
        userName={profile.full_name}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <main className="mr-0 lg:mr-[220px] pt-[56px] min-h-screen">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}