'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

// ─── Types ────────────────────────────────────────────────────────────────────

type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

export interface VolunteerApplication {
  id: string
  status: ApplicationStatus
  applied_at: string
  opportunity: {
    id: string
    title: string
    category: string
  }
  org: {
    id: string
    full_name: string
  }
}

interface Props {
  applications: VolunteerApplication[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; bg: string; text: string; border: string }> = {
  accepted: { label: 'مقبول',        bg: '#E1F5EE', text: '#0F6E56', border: '#0F6E56' },
  pending:  { label: 'قيد المراجعة', bg: '#FAECE7', text: '#993C1D', border: '#D85A30' },
  rejected: { label: 'مرفوض',        bg: '#FCEBEB', text: '#A32D2D', border: '#A32D2D' },
}

const CATEGORY_ICONS: Record<string, string> = {
  طبي:       '➕',
  تعليمي:    '📚',
  لوجستي:    '🚛',
  'دعم نفسي': '🧠',
  تقني:      '💻',
  إغاثي:     '🎗️',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

type FilterType = 'all' | ApplicationStatus

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ value, label, active }: { value: number; label: string; active: boolean }) {
  return (
    <div
      className="rounded-xl p-5 text-center border transition-all"
      style={{
        backgroundColor: active ? '#EEEDFE' : '#FFFFFF',
        borderColor: active ? '#AFA9EC' : '#E5E5E5',
        borderWidth: active ? '1px' : '0.5px',
      }}
    >
      <div
        className="text-[22px] font-medium leading-none mb-1"
        style={{ color: active ? '#3C3489' : '#1A1A1A' }}
      >
        {value.toLocaleString('ar-EG')}
      </div>
      <div className="text-[13px] mt-2" style={{ color: '#666666' }}>{label}</div>
    </div>
  )
}

function ApplicationCard({ application }: { application: VolunteerApplication }) {
  const config = STATUS_CONFIG[application.status]
  const icon = CATEGORY_ICONS[application.opportunity.category] ?? '📋'

  return (
    <div
      className="bg-white rounded-xl px-5 py-4 flex items-center justify-between"
      style={{
        border: '0.5px solid #E5E5E5',
        borderRight: `3px solid ${config.border}`,
      }}
    >
      {/* Status badge — left */}
      <div className="flex-shrink-0">
        <span
          className="text-[12px] font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: config.bg, color: config.text }}
        >
          {config.label}
        </span>
      </div>

      {/* Info — right */}
      <div className="flex items-center gap-4 flex-row-reverse flex-1 text-right">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[18px] flex-shrink-0"
          style={{ backgroundColor: '#F6F2FA' }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <div>
          <p className="text-[15px] font-medium" style={{ color: '#1A1A1A' }}>
            {application.opportunity.title}
          </p>
          <div className="flex items-center gap-3 mt-1 flex-row-reverse justify-end">
            <span className="text-[13px]" style={{ color: '#666666' }}>
              🏢 {application.org.full_name}
            </span>
            <span className="text-[12px]" style={{ color: '#787582' }}>
              تم التقديم: {formatDate(application.applied_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VolunteerApplicationsPage({ applications }: Props) {
  const [filter, setFilter] = useState<FilterType>('all')

  const total    = applications.length
  const accepted = applications.filter((a) => a.status === 'accepted').length
  const rejected = applications.filter((a) => a.status === 'rejected').length

  const filtered = filter === 'all'
    ? applications
    : applications.filter((a) => a.status === filter)

  return (
    <DashboardLayout title="تقديماتي" role="volunteer">
      <div dir="rtl">
        {/* Header */}
        <div className="text-right mb-6">
          <h2 className="text-[22px] font-medium" style={{ color: '#1A1A1A' }}>تقديماتي</h2>
          <p className="text-[14px] mt-1" style={{ color: '#666666' }}>
            تتبع حالة طلباتك للفرص التطوعية
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard value={rejected} label="مرفوضة"          active={false} />
          <StatCard value={accepted} label="مقبولة"          active={true}  />
          <StatCard value={total}    label="إجمالي التقديمات" active={false} />
        </div>

        {/* Filter pills */}
        <div className="flex items-center justify-end gap-2 mb-5">
          {(
            [
              { key: 'all',      label: 'الكل'          },
              { key: 'accepted', label: 'مقبول'         },
              { key: 'pending',  label: 'قيد المراجعة'  },
              { key: 'rejected', label: 'مرفوض'         },
            ] as { key: FilterType; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 border"
              style={
                filter === f.key
                  ? { backgroundColor: '#3C3489', color: '#ffffff', borderColor: '#3C3489' }
                  : { backgroundColor: 'transparent', color: '#474551', borderColor: '#C8C4D3' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {total === 0 ? (
          <div className="text-center py-16" style={{ color: '#666666' }}>
            <p className="text-[15px] mb-1">لم تقدّم على أي فرصة بعد</p>
            <p className="text-[13px]">استكشف الفرص المتاحة وابدأ رحلتك التطوعية</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[14px]" style={{ color: '#666666' }}>
            لا توجد تقديمات في هذه الفئة
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}