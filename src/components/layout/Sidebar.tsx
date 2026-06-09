'use client'

import Link from 'next/link'
import Image from 'next/image' // استيراد مكون الصورة من Next.js
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import {
  LayoutDashboard,
  Search,
  FileText,
  Award,
  Bell,
  Settings,
  LogOut,
  Building2,
  Users,
  Briefcase,
} from 'lucide-react'
import { signOutAction } from '@/features/auth/actions/auth.actions'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const volunteerNav: NavItem[] = [
  { href: '/dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/opportunities', label: 'استكشاف الفرص', icon: <Search size={18} /> },
  { href: '/dashboard/applications', label: 'تقديماتي', icon: <FileText size={18} /> },
  { href: '/dashboard/certificates', label: 'شهاداتي', icon: <Award size={18} /> },
  { href: '/dashboard/notifications', label: 'الإشعارات', icon: <Bell size={18} /> },
  { href: '/dashboard/profile', label: 'الإعدادات', icon: <Settings size={18} /> },
]

const orgNav: NavItem[] = [
  { href: '/dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/opportunities', label: 'فرصي', icon: <Briefcase size={18} /> },
  { href: '/dashboard/applications', label: 'المتقدمون', icon: <Users size={18} /> },
  { href: '/dashboard/notifications', label: 'الإشعارات', icon: <Bell size={18} /> },
  { href: '/dashboard/profile', label: 'الإعدادات', icon: <Settings size={18} /> },
]

const adminNav: NavItem[] = [
  { href: '/dashboard/admin', label: 'لوحة التحكم', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/admin/volunteers', label: 'المتطوعون', icon: <Users size={18} /> },
  { href: '/dashboard/admin/orgs', label: 'المنظمات', icon: <Building2 size={18} /> },
  { href: '/dashboard/admin/opportunities', label: 'الفرص', icon: <Briefcase size={18} /> },
  { href: '/dashboard/notifications', label: 'الإشعارات', icon: <Bell size={18} /> },
]

const roleSubtitle: Record<string, string> = {
  volunteer: 'منصة التطوع المجتمعي',
  org: 'لوحة تحكم المنظمة',
  admin: 'لوحة تحكم الإدارة',
}

interface SidebarProps {
  role?: 'volunteer' | 'org' | 'admin'
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ role = 'volunteer', isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const navItems =
    role === 'org' ? orgNav : role === 'admin' ? adminNav : volunteerNav

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <>
      {/* Mobile backdrop — only renders when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          'fixed right-0 top-0 h-screen w-[220px] bg-white flex flex-col z-50',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
        style={{ borderLeft: '0.5px solid #E5E5E5' }}
      >
        {/* New Logo Section (Horizontal RTL Layout) */}
        <div
          className="px-5 pt-5 pb-4 text-right flex flex-col items-start gap-1"
          style={{ borderBottom: '0.5px solid #E5E5E5' }}
          dir="rtl"
        >
          {/* رابط العودة للرئيسية مدمج مع الهوية الأفقية الجديدة */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group select-none">
            <div className="transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-icon.png"
                alt="شعار موجود"
                width={32}
                height={32}
                priority
                className="object-contain"
              />
            </div>
            <span
              className="text-[20px] font-bold tracking-wide transition-colors"
              style={{ color: '#3C3489' }}
            >
              موجود
            </span>
          </Link>
          
          {/* الوصف الفرعي أسفل اللوجو ممتد بعناية */}
          <div className="text-[11px] mt-0.5 pr-0.5" style={{ color: '#666666' }}>
            {roleSubtitle[role]}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={[
                      'flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium transition-all duration-150 w-full flex-row-reverse justify-end',
                      active
                        ? 'bg-[#EEEDFE] text-[#3C3489] border-r-[3px] border-[#3C3489] rounded-l-lg'
                        : 'text-[#474551] hover:bg-[#F6F2FA] hover:text-[#3C3489] rounded-lg',
                    ].join(' ')}
                  >
                    <span style={{ color: active ? '#3C3489' : '#787582' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div
          className="px-3 pb-6"
          style={{ borderTop: '0.5px solid #E5E5E5' }}
        >
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-[14px] font-medium text-[#474551] hover:bg-[#FCEBEB] hover:text-[#A32D2D] transition-all duration-150 flex-row-reverse justify-end mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={18} />
            <span>{isPending ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}</span>
          </button>
        </div>
      </aside>
    </>
  )
}