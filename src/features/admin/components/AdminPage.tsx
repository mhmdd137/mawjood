'use client'

import { useState, useTransition } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  approveOrganization,
  rejectOrganization,
  revokeOrganization,
} from '@/features/admin/actions/admin.actions'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatsData {
  totalVolunteers: number
  totalOrgs: number
  totalOpportunities: number
  totalApplications: number
  totalCertificates: number
}

export interface OrgCard {
  id: string
  full_name: string
  bio: string
  created_at: string
}

export interface RecentOpportunity {
  id: string
  title: string
  org_name: string
  status: 'draft' | 'open' | 'closed' | 'completed'
}

export interface RecentApplication {
  id: string
  volunteer_name: string
  opportunity_title: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface RecentCertificate {
  id: string
  volunteer_name: string
  opportunity_title: string
  hours_logged: number
}

export interface GrowthDataPoint {
  month: string
  volunteers: number
  opportunities: number
}

export interface AdminPageProps {
  stats: StatsData
  pendingOrgs: OrgCard[]
  verifiedOrgs: OrgCard[]
  recentOpportunities: RecentOpportunity[]
  recentApplications: RecentApplication[]
  recentCertificates: RecentCertificate[]
  growthData: GrowthDataPoint[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  open:      { label: 'مفتوحة',       bg: '#E1F5EE', color: '#0F6E56' },
  closed:    { label: 'مغلقة',        bg: '#FCEBEB', color: '#A32D2D' },
  completed: { label: 'مكتملة',       bg: '#FAEEDA', color: '#854F0B' },
  draft:     { label: 'مسودة',        bg: '#F0ECF4', color: '#666666' },
  pending:   { label: 'قيد المراجعة', bg: '#FAECE7', color: '#993C1D' },
  accepted:  { label: 'مقبول',        bg: '#E1F5EE', color: '#0F6E56' },
  rejected:  { label: 'مرفوض',        bg: '#FCEBEB', color: '#A32D2D' },
} as const

function StatusBadge({ status }: { status: keyof typeof STATUS_MAP }) {
  const { label, bg, color } = STATUS_MAP[status]
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: bg, color }}>
      {label}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getInitial(name: string) {
  return name.trim().charAt(0) || '؟'
}

// ─── Stats row ────────────────────────────────────────────────────────────────

function StatsRow({ stats }: { stats: StatsData }) {
  const items = [
    { label: 'متطوع', value: stats.totalVolunteers },
    { label: 'منظمة', value: stats.totalOrgs },
    { label: 'فرصة', value: stats.totalOpportunities },
    { label: 'تقديم', value: stats.totalApplications },
    { label: 'شهادة', value: stats.totalCertificates },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl px-4 py-4 text-right"
          style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
        >
          <p className="text-[22px] font-medium" style={{ color: '#3C3489' }}>
            {item.value.toLocaleString('ar-EG')}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#666666' }}>{item.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Growth chart ─────────────────────────────────────────────────────────────

function GrowthChart({ data }: { data: GrowthDataPoint[] }) {
  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
    >
      <p className="text-sm font-medium text-right mb-4" style={{ color: '#1A1A1A' }}>نمو المنصة</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolunteers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3C3489" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3C3489" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorOpportunities" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D85A30" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#D85A30" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#666666' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#666666' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '0.5px solid #E5E5E5',
              borderRadius: 8,
              fontSize: 13,
              direction: 'rtl',
            }}
          />
          <Area
            type="monotone"
            dataKey="volunteers"
            name="متطوعون"
            stroke="#3C3489"
            strokeWidth={2}
            fill="url(#colorVolunteers)"
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="opportunities"
            name="فرص"
            stroke="#D85A30"
            strokeWidth={2}
            fill="url(#colorOpportunities)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-end gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: '#666666' }}>فرص</span>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#D85A30' }} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs" style={{ color: '#666666' }}>متطوعون</span>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3C3489' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Org row ──────────────────────────────────────────────────────────────────

function OrgRow({
  org,
  isVerified,
  onApprove,
  onReject,
  onRevoke,
}: {
  org: OrgCard
  isVerified: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onRevoke?: (id: string) => void
}) {
  const [actionDone, setActionDone] = useState<'approved' | 'rejected' | 'revoked' | null>(null)
  const [isPending, startTransition] = useTransition()

  if (actionDone === 'approved') {
    return (
      <div className="flex items-center justify-end gap-2 rounded-xl px-4 py-3" style={{ backgroundColor: '#E1F5EE', border: '0.5px solid #B6E8D5' }}>
        <p className="text-xs font-medium" style={{ color: '#0F6E56' }}>تم قبول {org.full_name}</p>
      </div>
    )
  }
  if (actionDone === 'rejected') {
    return (
      <div className="flex items-center justify-end gap-2 rounded-xl px-4 py-3" style={{ backgroundColor: '#FCEBEB', border: '0.5px solid #F0CECE' }}>
        <p className="text-xs font-medium" style={{ color: '#A32D2D' }}>تم رفض {org.full_name}</p>
      </div>
    )
  }
  if (actionDone === 'revoked') {
    return (
      <div className="flex items-center justify-end gap-2 rounded-xl px-4 py-3" style={{ backgroundColor: '#FAECE7', border: '0.5px solid #F0C4B0' }}>
        <p className="text-xs font-medium" style={{ color: '#993C1D' }}>تم إلغاء توثيق {org.full_name}</p>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-4 rounded-xl px-4 py-4" style={{ backgroundColor: '#F9F9F9', border: '0.5px solid #E5E5E5' }}>
      <div className="flex gap-2 flex-shrink-0 pt-0.5">
        {!isVerified && (
          <>
            <button
              disabled={isPending}
              onClick={() => startTransition(async () => {
                await rejectOrganization(org.id)
                setActionDone('rejected')
                onReject?.(org.id)
              })}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 disabled:opacity-60"
              style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5', color: '#A32D2D' }}
            >
              رفض
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(async () => {
                await approveOrganization(org.id)
                setActionDone('approved')
                onApprove?.(org.id)
              })}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors duration-150 disabled:opacity-60"
              style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
            >
              قبول
            </button>
          </>
        )}
        {isVerified && (
          <button
            disabled={isPending}
            onClick={() => startTransition(async () => {
              await revokeOrganization(org.id)
              setActionDone('revoked')
              onRevoke?.(org.id)
            })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 disabled:opacity-60"
            style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5', color: '#993C1D' }}
          >
            إلغاء التوثيق
          </button>
        )}
      </div>

      <div className="flex-1 text-right">
        <div className="flex items-center justify-end gap-2 mb-1">
          <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{org.full_name}</p>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
            style={{ backgroundColor: '#3C3489' }}
            aria-hidden="true"
          >
            {getInitial(org.full_name)}
          </div>
        </div>
        {org.bio && (
          <p className="text-xs leading-relaxed mb-1" style={{ color: '#666666' }}>{org.bio}</p>
        )}
        <p className="text-xs" style={{ color: '#9CA3AF' }}>
          تاريخ الانضمام: {formatDate(org.created_at)}
        </p>
      </div>
    </div>
  )
}

// ─── Pending orgs ─────────────────────────────────────────────────────────────

function PendingOrgs({
  orgs,
  verifiedOrgs,
}: {
  orgs: OrgCard[]
  verifiedOrgs: OrgCard[]
}) {
  const [pending, setPending] = useState(orgs)
  const [verified, setVerified] = useState(verifiedOrgs)

  return (
    <div className="flex flex-col gap-4">
      {/* Pending */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}>
        <div className="flex items-center justify-between mb-4">
          {pending.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FAECE7', color: '#993C1D' }}>
              {pending.length}
            </span>
          )}
          <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>المنظمات المعلّقة</p>
        </div>
        {pending.length === 0 ? (
          <p className="text-xs text-right" style={{ color: '#9CA3AF' }}>لا توجد منظمات بانتظار المراجعة</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((org) => (
              <OrgRow
                key={org.id}
                org={org}
                isVerified={false}
                onApprove={(id) => {
                  setPending((p) => p.filter((o) => o.id !== id))
                  setVerified((v) => [...v, orgs.find((o) => o.id === id)!])
                }}
                onReject={(id) => setPending((p) => p.filter((o) => o.id !== id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* Verified */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}>
        <div className="flex items-center justify-between mb-4">
          {verified.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}>
              {verified.length}
            </span>
          )}
          <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>المنظمات الموثّقة</p>
        </div>
        {verified.length === 0 ? (
          <p className="text-xs text-right" style={{ color: '#9CA3AF' }}>لا توجد منظمات موثّقة بعد</p>
        ) : (
          <div className="flex flex-col gap-3">
            {verified.map((org) => (
              <OrgRow
                key={org.id}
                org={org}
                isVerified={true}
                onRevoke={(id) => setVerified((v) => v.filter((o) => o.id !== id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Recent activity ──────────────────────────────────────────────────────────

function RecentActivity({
  opportunities,
  applications,
  certificates,
}: {
  opportunities: RecentOpportunity[]
  applications: RecentApplication[]
  certificates: RecentCertificate[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}>
        <p className="text-sm font-medium text-right mb-3" style={{ color: '#1A1A1A' }}>آخر الفرص</p>
        {opportunities.length === 0 ? (
          <p className="text-xs text-right" style={{ color: '#9CA3AF' }}>لا توجد فرص بعد</p>
        ) : (
          <div className="flex flex-col gap-2">
            {opportunities.map((opp) => (
              <div key={opp.id} className="flex items-center justify-between gap-2">
                <StatusBadge status={opp.status} />
                <div className="text-right flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: '#1A1A1A' }}>{opp.title}</p>
                  <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{opp.org_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}>
        <p className="text-sm font-medium text-right mb-3" style={{ color: '#1A1A1A' }}>آخر التقديمات</p>
        {applications.length === 0 ? (
          <p className="text-xs text-right" style={{ color: '#9CA3AF' }}>لا توجد تقديمات بعد</p>
        ) : (
          <div className="flex flex-col gap-2">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between gap-2">
                <StatusBadge status={app.status} />
                <div className="text-right flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: '#1A1A1A' }}>{app.volunteer_name}</p>
                  <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{app.opportunity_title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}>
        <p className="text-sm font-medium text-right mb-3" style={{ color: '#1A1A1A' }}>آخر الشهادات</p>
        {certificates.length === 0 ? (
          <p className="text-xs text-right" style={{ color: '#9CA3AF' }}>لا توجد شهادات بعد</p>
        ) : (
          <div className="flex flex-col gap-2">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EEEDFE' }} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="6" stroke="#3C3489" strokeWidth="1.5"/>
                    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="text-right flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: '#1A1A1A' }}>{cert.volunteer_name}</p>
                  <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{cert.opportunity_title} · {cert.hours_logged} ساعة</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminPage({
  stats,
  pendingOrgs,
  verifiedOrgs,
  recentOpportunities,
  recentApplications,
  recentCertificates,
  growthData,
}: AdminPageProps) {
  return (
    <DashboardLayout role="admin" title="لوحة التحكم">
      <div dir="rtl">
        <div className="mb-6 text-right">
          <p className="text-xs" style={{ color: '#9CA3AF' }}>نظرة عامة على المنصة</p>
        </div>

        <StatsRow stats={stats} />
        <GrowthChart data={growthData} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PendingOrgs orgs={pendingOrgs} verifiedOrgs={verifiedOrgs} />
          </div>
          <div className="lg:col-span-5">
            <RecentActivity
              opportunities={recentOpportunities}
              applications={recentApplications}
              certificates={recentCertificates}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}