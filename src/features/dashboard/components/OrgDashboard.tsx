'use client'

import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatsCard from './shared/StatsCard'
import { updateApplicationStatus } from '@/features/applications/actions/applications.actions'
import { useTransition, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PendingApplication {
  id: string
  volunteer_name: string
  opportunity_title: string
  applied_at: string
}

export interface OrgOpportunity {
  id: string
  title: string
  status: 'draft' | 'open' | 'closed' | 'completed'
  applications_count: number
}

export interface OrgStats {
  openOpportunities: number
  newApplications: number
  totalCertificates: number
}

interface Props {
  orgName: string
  isVerified: boolean
  stats: OrgStats
  pendingApplications: PendingApplication[]
  opportunities: OrgOpportunity[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  open:      { label: 'مفتوحة', bg: '#E1F5EE', color: '#0F6E56' },
  closed:    { label: 'مغلقة',  bg: '#FCEBEB', color: '#A32D2D' },
  completed: { label: 'مكتملة', bg: '#FAEEDA', color: '#854F0B' },
  draft:     { label: 'مسودة',  bg: '#F0ECF4', color: '#666666' },
} as const

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'short',
  })
}

// ─── Pending application item ─────────────────────────────────────────────────

function PendingItem({
  app,
  onAction,
}: {
  app: PendingApplication
  onAction: (id: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState<'accepted' | 'rejected' | null>(null)

  if (done) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-right text-xs font-medium"
        style={{
          backgroundColor: done === 'accepted' ? '#E1F5EE' : '#FCEBEB',
          color: done === 'accepted' ? '#0F6E56' : '#A32D2D',
          border: `0.5px solid ${done === 'accepted' ? '#B6E8D5' : '#F0CECE'}`,
        }}
      >
        {done === 'accepted' ? `تم قبول ${app.volunteer_name}` : `تم رفض ${app.volunteer_name}`}
      </div>
    )
  }

  function handleAction(status: 'accepted' | 'rejected') {
    startTransition(async () => {
      await updateApplicationStatus(app.id, status)
      setDone(status)
      onAction(app.id)
    })
  }

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
    >
      <div className="flex gap-2 flex-shrink-0">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleAction('rejected')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 disabled:opacity-50"
          style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5', color: '#A32D2D' }}
          aria-label={`رفض تقديم ${app.volunteer_name}`}
        >
          رفض
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleAction('accepted')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors duration-150 disabled:opacity-50"
          style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
          aria-label={`قبول تقديم ${app.volunteer_name}`}
        >
          قبول
        </button>
      </div>

      <div className="flex-1 text-right min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{app.volunteer_name}</p>
        <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>
          {app.opportunity_title} · {formatDate(app.applied_at)}
        </p>
      </div>

      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
        style={{ backgroundColor: '#3C3489' }}
        aria-hidden="true"
      >
        {getInitials(app.volunteer_name)}
      </div>
    </div>
  )
}

// ─── Opportunity row ──────────────────────────────────────────────────────────

function OppRow({ opp }: { opp: OrgOpportunity }) {
  const { label, bg, color } = STATUS_MAP[opp.status]
  return (
    <Link
      href={`/dashboard/opportunities/${opp.id}`}
      className="flex items-center gap-4 rounded-xl px-4 py-3 transition-opacity duration-150 hover:opacity-80"
      style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
    >
      <div className="text-right flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{opp.title}</p>
        <p className="text-xs" style={{ color: '#9CA3AF' }}>{opp.applications_count} متقدم</p>
      </div>
      <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: bg, color }}>
        {label}
      </span>
    </Link>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrgDashboard({
  orgName,
  isVerified,
  stats,
  pendingApplications: initialPending,
  opportunities,
}: Props) {
  const [pending, setPending] = useState(initialPending)

  function handleAction(id: string) {
    setPending((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <DashboardLayout role="org" title="الرئيسية">
      <div dir="rtl">
        {/* Verification warning */}
        {!isVerified && (
          <div
            className="rounded-xl px-5 py-4 mb-5 text-right text-sm"
            style={{ backgroundColor: '#FAECE7', border: '0.5px solid #F0C4B0', color: '#993C1D' }}
          >
            حسابك قيد المراجعة — لا يمكنك نشر فرص حتى يتم التحقق من حسابك
          </div>
        )}

        {/* Hero banner */}
        <div
          className="rounded-xl px-6 py-5 mb-6 flex items-center justify-between"
          style={{ backgroundColor: '#EEEDFE', border: '0.5px solid #C5C0FF' }}
        >
          <Link
            href="/dashboard/opportunities/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity duration-150 hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            إضافة فرصة جديدة
          </Link>
          <div className="text-right">
            <p className="text-lg font-medium" style={{ color: '#1A1A1A' }}>أهلاً، {orgName}</p>
            <p className="text-sm mt-0.5" style={{ color: '#666666' }}>إليك آخر تحديثات منصتك</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard
            label="فرص مفتوحة"
            value={stats.openOpportunities}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="1.5" stroke="#3C3489" strokeWidth="1.5"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#3C3489" strokeWidth="1.5"/>
              </svg>
            }
          />
          <StatsCard
            label="تقديمات جديدة"
            value={stats.newApplications}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="#3C3489" strokeWidth="1.5"/>
              </svg>
            }
          />
          <StatsCard
            label="شهادات صادرة"
            value={stats.totalCertificates}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="6" stroke="#3C3489" strokeWidth="1.5"/>
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
        </div>

        <div className="flex gap-5">
          {/* Pending applications */}
          <div style={{ flex: 7 }}>
            <div className="flex items-center justify-between mb-3">
              <Link href="/dashboard/applications" className="text-xs transition-opacity duration-150 hover:opacity-70" style={{ color: '#3C3489' }}>
                عرض الكل
              </Link>
              <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>تقديمات بانتظار المراجعة</p>
            </div>
            <div className="flex flex-col gap-2">
              {pending.length === 0 ? (
                <div className="rounded-xl px-5 py-8 text-center" style={{ border: '0.5px dashed #E5E5E5' }}>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>لا توجد تقديمات بانتظار المراجعة</p>
                </div>
              ) : (
                pending.map((app) => (
                  <PendingItem key={app.id} app={app} onAction={handleAction} />
                ))
              )}
            </div>
          </div>

          {/* My opportunities */}
          <div style={{ flex: 5 }}>
            <div className="flex items-center justify-between mb-3">
              <Link href="/dashboard/opportunities" className="text-xs transition-opacity duration-150 hover:opacity-70" style={{ color: '#3C3489' }}>
                عرض الكل
              </Link>
              <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>فرصي</p>
            </div>
            <div className="flex flex-col gap-2">
              {opportunities.length === 0 ? (
                <div className="rounded-xl px-5 py-8 text-center" style={{ border: '0.5px dashed #E5E5E5' }}>
                  <p className="text-sm" style={{ color: '#9CA3AF' }}>لم تنشر أي فرص بعد</p>
                </div>
              ) : (
                opportunities.map((opp) => <OppRow key={opp.id} opp={opp} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}