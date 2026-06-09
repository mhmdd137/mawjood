'use client'

import Link from 'next/link'
import DashboardLayout from '@/components/layout/DashboardLayout'
import StatsCard from './shared/StatsCard'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OpportunityCard {
  id: string
  title: string
  org_name: string
  category: string
  status: 'open'
  score: number
}

export interface ApplicationItem {
  id: string
  opportunity_title: string
  org_name: string
  status: 'pending' | 'accepted' | 'rejected'
  applied_at: string
}

export interface VolunteerStats {
  activeApplications: number
  acceptedOpportunities: number
  certificates: number
}

interface Props {
  userName: string
  stats: VolunteerStats
  opportunities: OpportunityCard[]
  applications: ApplicationItem[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  accepted: { label: 'مقبول',        bg: '#E1F5EE', color: '#0F6E56' },
  pending:  { label: 'قيد المراجعة', bg: '#FAECE7', color: '#993C1D' },
  rejected: { label: 'مرفوض',        bg: '#FCEBEB', color: '#A32D2D' },
} as const

function scoreBorderColor(score: number): string {
  if (score >= 80) return '#534AB7'
  if (score >= 40) return '#AFA9EC'
  return '#E5E5E5'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'short',
  })
}

// ─── Opportunity card ─────────────────────────────────────────────────────────

function OpportunityItem({ opp }: { opp: OpportunityCard }) {
  const borderColor = scoreBorderColor(opp.score)

  return (
    <Link
      href={`/opportunities/${opp.id}`}
      className="block rounded-xl p-4 transition-colors duration-150 hover:opacity-90"
      style={{
        backgroundColor: 'white',
        border: '0.5px solid #E5E5E5',
        borderRight: `3px solid ${borderColor}`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E1F5EE', color: '#0F6E56' }}>
          متاح
        </span>
        <span className="text-xs font-medium" style={{ color: '#3C3489' }}>
          {opp.score}% تطابق
        </span>
      </div>
      <p className="text-sm font-medium text-right mb-1" style={{ color: '#1A1A1A' }}>{opp.title}</p>
      <p className="text-xs text-right mb-3" style={{ color: '#666666' }}>{opp.org_name}</p>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 5, backgroundColor: '#F0ECF4' }}
        role="progressbar"
        aria-valuenow={opp.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`نسبة التطابق ${opp.score}%`}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${opp.score}%`, backgroundColor: borderColor, transition: 'width 600ms ease' }}
        />
      </div>
    </Link>
  )
}

// ─── Application item ─────────────────────────────────────────────────────────

function ApplicationRow({ app }: { app: ApplicationItem }) {
  const { label, bg, color } = STATUS_MAP[app.status]
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-4 py-3"
      style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
    >
      <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: bg, color }}>
        {label}
      </span>
      <div className="flex-1 text-right min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{app.opportunity_title}</p>
        <p className="text-xs" style={{ color: '#9CA3AF' }}>
          {app.org_name} · تم التقديم: {formatDate(app.applied_at)}
        </p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VolunteerDashboard({ userName, stats, opportunities, applications }: Props) {
  return (
    <DashboardLayout role="volunteer" title="الرئيسية">
      <div dir="rtl">
        {/* Hero banner */}
        <div
          className="rounded-xl px-6 py-5 mb-6 flex items-center justify-between"
          style={{ backgroundColor: '#FAECE7', border: '0.5px solid #F0C4B0' }}
        >
          <Link
            href="/opportunities"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity duration-150 hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: '#D85A30', border: '0.5px solid #993C1D' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            استكشف فرصاً جديدة
          </Link>
          <div className="text-right">
            <p className="text-lg font-medium" style={{ color: '#1A1A1A' }}>👋 أهلاً، {userName}</p>
            <p className="text-sm mt-0.5" style={{ color: '#666666' }}>مستعد لإحداث تأثير في مجتمعك اليوم؟</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatsCard
            label="تقديمات نشطة"
            value={stats.activeApplications}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#3C3489" strokeWidth="1.5"/>
                <path d="M14 2v6h6M9 13h6M9 17h4" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
          <StatsCard
            label="فرص مقبولة"
            value={stats.acceptedOpportunities}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12l4 4L19 8" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
          <StatsCard
            label="شهادات مكتسبة"
            value={stats.certificates}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="6" stroke="#3C3489" strokeWidth="1.5"/>
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          />
        </div>

        {/* Suggested opportunities */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Link href="/opportunities" className="text-xs transition-opacity duration-150 hover:opacity-70" style={{ color: '#3C3489' }}>
              عرض الكل
            </Link>
            <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>الفرص المقترحة لك</p>
          </div>
          {opportunities.length === 0 ? (
            <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}>
              <p className="text-sm mb-3" style={{ color: '#666666' }}>لا توجد فرص مقترحة حالياً</p>
              <Link href="/opportunities" className="text-xs font-medium" style={{ color: '#3C3489' }}>استكشف كل الفرص</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {opportunities.map((opp) => <OpportunityItem key={opp.id} opp={opp} />)}
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Link href="/dashboard/applications" className="text-xs transition-opacity duration-150 hover:opacity-70" style={{ color: '#3C3489' }}>
              عرض الكل
            </Link>
            <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>آخر تقديماتي</p>
          </div>
          {applications.length === 0 ? (
            <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}>
              <p className="text-sm" style={{ color: '#666666' }}>لم تقدّم على أي فرصة بعد</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {applications.map((app) => <ApplicationRow key={app.id} app={app} />)}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}