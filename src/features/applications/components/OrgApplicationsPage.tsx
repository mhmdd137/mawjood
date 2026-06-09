'use client'

import { useState, useTransition } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { updateApplicationStatus } from '@/features/applications/actions/applications.actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type ApplicationStatus = 'pending' | 'accepted' | 'rejected'
type OpportunityStatus = 'open' | 'closed' | 'completed' | 'draft'

export interface OrgApplicant {
  id: string
  status: ApplicationStatus
  applied_at: string
  message: string
  volunteer: {
    id: string
    full_name: string
    skills: string[]
    location: string
  }
}

export interface OrgOpportunityGroup {
  id: string
  title: string
  status: OpportunityStatus
  applicants: OrgApplicant[]
}

interface Props {
  groups: OrgOpportunityGroup[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OPP_STATUS_CONFIG: Record<OpportunityStatus, { label: string; bg: string; text: string }> = {
  open:      { label: 'مفتوحة', bg: '#E1F5EE', text: '#0F6E56' },
  closed:    { label: 'مغلقة',  bg: '#FCEBEB', text: '#A32D2D' },
  completed: { label: 'مكتملة', bg: '#FAEEDA', text: '#854F0B' },
  draft:     { label: 'مسودة',  bg: '#F0ECF4', text: '#666666' },
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : parts[0].slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="rounded-xl p-5 text-center"
      style={{ backgroundColor: '#FFFFFF', border: '0.5px solid #E5E5E5' }}
    >
      <div className="text-[22px] font-medium leading-none" style={{ color: '#993C1D' }}>
        {value.toLocaleString('ar-EG')}
      </div>
      <div className="text-[13px] mt-2" style={{ color: '#666666' }}>{label}</div>
    </div>
  )
}

function ApplicantCard({
  applicant,
  onStatusChange,
}: {
  applicant: OrgApplicant
  onStatusChange: (id: string, status: 'accepted' | 'rejected') => void
}) {
  const [isPending, startTransition] = useTransition()
  const isDecided = applicant.status !== 'pending'

  function handleAction(action: 'accepted' | 'rejected') {
    startTransition(async () => {
      await updateApplicationStatus(applicant.id, action)
      onStatusChange(applicant.id, action)
    })
  }

  return (
    <div
      className="bg-white rounded-xl p-4 flex items-start gap-4"
      style={{ border: '0.5px solid #E5E5E5' }}
    >
      {/* Action buttons — left */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          onClick={() => handleAction('accepted')}
          disabled={isDecided || isPending}
          className="px-5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: applicant.status === 'accepted' ? '#E1F5EE' : 'transparent',
            color: '#0F6E56',
            border: `0.5px solid ${applicant.status === 'accepted' ? '#0F6E56' : '#C8C4D3'}`,
          }}
        >
          قبول
        </button>
        <button
          onClick={() => handleAction('rejected')}
          disabled={isDecided || isPending}
          className="px-5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: applicant.status === 'rejected' ? '#FCEBEB' : 'transparent',
            color: '#A32D2D',
            border: '0.5px solid #A32D2D',
          }}
        >
          رفض
        </button>
      </div>

      {/* Message */}
      <div
        className="flex-1 rounded-lg px-3 py-2 text-[13px] text-right"
        style={{ backgroundColor: '#F6F2FA', color: '#474551', minHeight: '44px' }}
      >
        "{applicant.message}"
      </div>

      {/* Info — right */}
      <div className="flex items-start gap-3 flex-row-reverse flex-shrink-0 text-right">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-medium flex-shrink-0"
          style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}
          aria-hidden="true"
        >
          {getInitials(applicant.volunteer.full_name)}
        </div>
        <div>
          <p className="text-[15px] font-medium" style={{ color: '#1A1A1A' }}>
            {applicant.volunteer.full_name}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5 justify-end">
            {applicant.volunteer.skills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: '#E5E1E9', color: '#474551' }}
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-[12px] mt-1.5" style={{ color: '#787582' }}>
            قُدِّم {formatDate(applicant.applied_at)}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrgApplicationsPage({ groups: initialGroups }: Props) {
  const [groups, setGroups] = useState<OrgOpportunityGroup[]>(initialGroups)

  const allApplicants = groups.flatMap((g) => g.applicants)
  const total    = allApplicants.length
  const pending  = allApplicants.filter((a) => a.status === 'pending').length
  const decided  = allApplicants.filter((a) => a.status !== 'pending').length

  function handleStatusChange(groupId: string, applicantId: string, status: 'accepted' | 'rejected') {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              applicants: group.applicants.map((a) =>
                a.id === applicantId ? { ...a, status } : a
              ),
            }
          : group
      )
    )
  }

  return (
    <DashboardLayout title="المتقدمون" role="org">
      <div dir="rtl">
        {/* Header */}
        <div className="text-right mb-6">
          <h2 className="text-[22px] font-medium" style={{ color: '#1A1A1A' }}>
            المتقدمون على فرصي
          </h2>
          <p className="text-[14px] mt-1" style={{ color: '#666666' }}>
            راجع طلبات المتطوعين وقبل أو ارفض
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard value={decided} label="تم البت فيهم"      />
          <StatCard value={pending} label="قيد المراجعة"       />
          <StatCard value={total}   label="إجمالي المتقدمين"   />
        </div>

        {/* Groups */}
        {groups.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#666666' }}>
            <p className="text-[15px]">لا يوجد متقدمون بعد</p>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => {
              const oppStatus = OPP_STATUS_CONFIG[group.status]
              return (
                <div key={group.id}>
                  {/* Group header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[12px] font-medium px-3 py-1 rounded-full border"
                        style={{ backgroundColor: '#EEEDFE', color: '#3C3489', borderColor: '#AFA9EC' }}
                      >
                        {group.applicants.length} متقدم
                      </span>
                      <span
                        className="text-[12px] font-medium px-3 py-1 rounded-full"
                        style={{ backgroundColor: oppStatus.bg, color: oppStatus.text }}
                      >
                        {oppStatus.label}
                      </span>
                    </div>
                    <h3 className="text-[18px] font-medium text-right" style={{ color: '#1A1A1A' }}>
                      {group.title}
                    </h3>
                  </div>

                  {/* Applicant cards */}
                  {group.applicants.length === 0 ? (
                    <p className="text-[13px] text-right" style={{ color: '#9CA3AF' }}>
                      لا يوجد متقدمون على هذه الفرصة
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {group.applicants.map((applicant) => (
                        <ApplicantCard
                          key={applicant.id}
                          applicant={applicant}
                          onStatusChange={(id, status) =>
                            handleStatusChange(group.id, id, status)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}