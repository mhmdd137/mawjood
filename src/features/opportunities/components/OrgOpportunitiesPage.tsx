'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useTransition } from 'react'
import { deleteOpportunity, updateOpportunityStatus } from '@/features/opportunities/actions/opportunities.actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type OppStatus = 'draft' | 'open' | 'closed' | 'completed'

export interface OrgOpportunity {
  id: string
  title: string
  status: OppStatus
  start_date: string
  end_date: string
  created_at: string
  application_count: number
}

interface Props {
  opportunities: OrgOpportunity[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OppStatus, string> = {
  draft:     'مسودة',
  open:      'مفتوحة',
  closed:    'مغلقة',
  completed: 'مكتملة',
}

const STATUS_STYLES: Record<OppStatus, { bg: string; color: string }> = {
  draft:     { bg: '#F0ECF4', color: '#666666' },
  open:      { bg: '#E1F5EE', color: '#0F6E56' },
  closed:    { bg: '#FCEBEB', color: '#A32D2D' },
  completed: { bg: '#FAEEDA', color: '#854F0B' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Opportunity Row ──────────────────────────────────────────────────────────

function OpportunityRow({ opp }: { opp: OrgOpportunity }) {
  const [isPending, startTransition] = useTransition()
  const style = STATUS_STYLES[opp.status]

  function handleDelete() {
    if (!confirm('هل أنت متأكد من حذف هذه الفرصة؟')) return
    startTransition(async () => {
      await deleteOpportunity(opp.id)
    })
  }

  function handleClose() {
    startTransition(async () => {
      await updateOpportunityStatus(opp.id, 'closed')
    })
  }

  return (
    <div
      className="bg-white rounded-xl p-5 flex items-center justify-between gap-4"
      style={{ border: '0.5px solid #E5E5E5' }}
    >
      {/* Right: info */}
      <div className="flex flex-col gap-1.5 text-right flex-1 min-w-0">
        <div className="flex items-center gap-2 justify-end">
          <h3 className="text-[15px] font-medium truncate" style={{ color: '#1A1A1A' }}>
            {opp.title}
          </h3>
          <span
            className="text-[11px] font-medium px-2.5 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            {STATUS_LABELS[opp.status]}
          </span>
        </div>
        <div className="flex items-center gap-3 justify-end flex-wrap">
          <span className="text-[12px]" style={{ color: '#666666' }}>
            {formatDate(opp.start_date)} — {formatDate(opp.end_date)}
          </span>
          <span
            className="text-[12px] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}
          >
            {opp.application_count} متقدم
          </span>
        </div>
      </div>

      {/* Left: actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {opp.status === 'open' && (
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 disabled:opacity-50"
            style={{ border: '0.5px solid #A32D2D', color: '#A32D2D', backgroundColor: 'transparent' }}
          >
            إغلاق
          </button>
        )}
        <Link
          href={`/dashboard/opportunities/${opp.id}`}
          className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
          style={{ border: '0.5px solid #3C3489', color: '#3C3489', backgroundColor: 'transparent' }}
        >
          إدارة
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 disabled:opacity-50"
          style={{ border: '0.5px solid #E5E5E5', color: '#666666', backgroundColor: 'transparent' }}
          aria-label={`حذف ${opp.title}`}
        >
          حذف
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrgOpportunitiesPage({ opportunities }: Props) {
  return (
    <DashboardLayout title="فرصي التطوعية" role="org">
      <div dir="rtl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard/opportunities/new"
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-all duration-150"
            style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
          >
            + فرصة جديدة
          </Link>
          <div className="text-right">
            <h1 className="text-[20px] font-medium" style={{ color: '#1A1A1A' }}>فرصي التطوعية</h1>
            <p className="text-[13px] mt-0.5" style={{ color: '#666666' }}>
              {opportunities.length} فرصة مسجلة
            </p>
          </div>
        </div>

        {/* List */}
        {opportunities.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 bg-white rounded-xl text-center"
            style={{ border: '0.5px solid #E5E5E5' }}
          >
            <p className="text-[15px] font-medium mb-2" style={{ color: '#1A1A1A' }}>
              لا توجد فرص بعد
            </p>
            <p className="text-[13px] mb-6" style={{ color: '#666666' }}>
              أنشئ أول فرصة تطوعية لمنظمتك
            </p>
            <Link
              href="/dashboard/opportunities/new"
              className="px-5 py-2 rounded-lg text-[13px] font-medium text-white"
              style={{ backgroundColor: '#3C3489' }}
            >
              + فرصة جديدة
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {opportunities.map((opp) => (
              <OpportunityRow key={opp.id} opp={opp} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}