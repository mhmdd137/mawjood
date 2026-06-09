'use client'

import { useActionState, useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { X, Check } from 'lucide-react'
import {
  updateOpportunity,
  updateOpportunityStatus,
} from '@/features/opportunities/actions/opportunities.actions'
import { updateApplicationStatus } from '@/features/applications/actions/applications.actions'
import { issueCertificate } from '@/features/certificates/actions/certificates.actions'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['طبي', 'تعليمي', 'لوجستي', 'دعم نفسي', 'تقني', 'إغاثي'] as const
const LOCATIONS  = ['غزة الشمالية', 'غزة', 'دير البلح', 'خانيونس', 'رفح'] as const
const SKILLS     = ['تمريض', 'إسعافات أولية', 'تدريس', 'دعم نفسي', 'لوجستيات', 'برمجة', 'تصميم', 'إدارة', 'طبخ', 'نقل'] as const

type TimeSlot  = 'morning' | 'afternoon' | 'flexible'
type OppStatus = 'draft' | 'open' | 'closed' | 'completed'
type AppStatus = 'pending' | 'accepted' | 'rejected'
type ActiveTab = 'details' | 'applicants'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OpportunityDetail {
  id: string
  title: string
  description: string
  category: string
  location: string
  start_date: string
  end_date: string
  required_skills: string[]
  time_slot: TimeSlot | null
  status: OppStatus
  created_at: string
}

export interface ApplicantDetail {
  id: string
  status: AppStatus
  applied_at: string
  message: string
  volunteer: {
    id: string
    full_name: string
    skills: string[]
    location: string
    avatar_url: string | null
  }
}

export interface OpportunityDetailPageProps {
  opportunity: OpportunityDetail
  applicants: ApplicantDetail[]
}

type UpdateState = {
  error: string | null
  success: boolean
  fieldErrors?: Partial<Record<'title' | 'description' | 'start_date' | 'end_date', string[]>>
}

const initialState: UpdateState = { error: null, success: false }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const OPP_STATUS_LABELS: Record<OppStatus, string> = {
  draft:     'مسودة',
  open:      'مفتوحة',
  closed:    'مغلقة',
  completed: 'مكتملة',
}

const OPP_STATUS_STYLES: Record<OppStatus, { bg: string; color: string }> = {
  draft:     { bg: '#F0ECF4', color: '#666666' },
  open:      { bg: '#E1F5EE', color: '#0F6E56' },
  closed:    { bg: '#FCEBEB', color: '#A32D2D' },
  completed: { bg: '#FAEEDA', color: '#854F0B' },
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string[]
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[14px] font-medium text-right" style={{ color: '#1A1A1A' }}>
        {label}
      </label>
      {children}
      {error?.[0] && (
        <p className="text-[12px] text-right" style={{ color: '#A32D2D' }} role="alert">
          {error[0]}
        </p>
      )}
    </div>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 text-[14px] font-medium transition-all duration-150"
      style={{
        color:        active ? '#3C3489' : '#787582',
        borderBottom: active ? '2px solid #3C3489' : '2px solid transparent',
      }}
    >
      {label}
    </button>
  )
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="px-5 py-2.5 rounded-lg text-[13px] font-medium text-white transition-all duration-150 disabled:opacity-70"
      style={{ backgroundColor: '#3C3489' }}
    >
      {pending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
    </button>
  )
}

// ─── Applicant Card ───────────────────────────────────────────────────────────

function ApplicantCard({
  applicant,
  onStatusChange,
}: {
  applicant: ApplicantDetail
  onStatusChange: (id: string, status: 'accepted' | 'rejected') => void
}) {
  const [isPending, startTransition] = useTransition()
  const [isIssuing, startIssueTransition] = useTransition()
  const [hours, setHours] = useState('')
  const [issueError, setIssueError] = useState<string | null>(null)
  const [issueSuccess, setIssueSuccess] = useState(false)
  const isDecided = applicant.status !== 'pending'

  function handleAction(action: 'accepted' | 'rejected') {
    startTransition(async () => {
      await updateApplicationStatus(applicant.id, action)
      onStatusChange(applicant.id, action)
    })
  }

  function handleIssueCertificate() {
    if (!hours || Number(hours) < 1) {
      setIssueError('أدخل عدد الساعات')
      return
    }
    setIssueError(null)
    startIssueTransition(async () => {
      const formData = new FormData()
      formData.append('application_id', applicant.id)
      formData.append('hours_logged', hours)
      const result = await issueCertificate(formData)
      if (result.error) {
        setIssueError(result.error)
      } else {
        setIssueSuccess(true)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-4" style={{ border: '0.5px solid #E5E5E5' }}>

      {/* Row — info + actions */}
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Actions */}
        <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
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
          {applicant.message}
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 flex-row-reverse flex-shrink-0 text-right">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-medium flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: '#EEEDFE', color: '#3C3489' }}
            aria-hidden="true"
          >
            {applicant.volunteer.avatar_url ? (
              <img
                src={applicant.volunteer.avatar_url}
                alt={applicant.volunteer.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(applicant.volunteer.full_name)
            )}
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

      {/* Issue Certificate — يظهر بس للمقبولين */}
      {applicant.status === 'accepted' && (
        <div
          className="flex items-center justify-between gap-3 pt-3 flex-row-reverse"
          style={{ borderTop: '0.5px solid #E5E5E5' }}
        >
          {issueSuccess ? (
            <div className="flex items-center gap-2 text-[13px] w-full justify-end" style={{ color: '#0F6E56' }}>
              <Check size={14} aria-hidden="true" />
              تم إصدار الشهادة بنجاح
            </div>
          ) : (
            <>
              <div className="flex flex-col items-start gap-1">
                <button
                  onClick={handleIssueCertificate}
                  disabled={isIssuing}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-all duration-150 disabled:opacity-60"
                  style={{ backgroundColor: '#D85A30' }}
                >
                  {isIssuing ? 'جاري الإصدار...' : 'إصدار شهادة'}
                </button>
                {issueError && (
                  <p className="text-[11px]" style={{ color: '#A32D2D' }} role="alert">
                    {issueError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-row-reverse">
                <label className="text-[13px]" style={{ color: '#474551' }}>
                  عدد ساعات التطوع
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="مثال: 20"
                  className="w-24 px-3 py-1.5 rounded-lg text-[13px] text-right outline-none"
                  style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
                  aria-label="عدد ساعات التطوع"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OpportunityDetailPage({
  opportunity,
  applicants: initialApplicants,
}: OpportunityDetailPageProps) {
  const [activeTab, setActiveTab]   = useState<ActiveTab>('details')
  const [applicants, setApplicants] = useState<ApplicantDetail[]>(initialApplicants)
  const [selectedSkills, setSelectedSkills] = useState<string[]>(opportunity.required_skills)
  const [timeSlot, setTimeSlot]     = useState<TimeSlot | null>(opportunity.time_slot)
  const [publishStatus, setPublishStatus] = useState<'draft' | 'open'>(
    opportunity.status === 'open' || opportunity.status === 'draft' ? opportunity.status : 'open'
  )
  const [closeError, setCloseError] = useState<string | null>(null)
  const [isClosing, startCloseTransition] = useTransition()

  const updateWithId = updateOpportunity.bind(null, opportunity.id)
  const [state, formAction] = useActionState(updateWithId, initialState)

  const availableSkills = SKILLS.filter((s) => !selectedSkills.includes(s))
  const oppStyle = OPP_STATUS_STYLES[opportunity.status]

  function removeSkill(skill: string) {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill))
  }

  function handleApplicantStatusChange(id: string, status: 'accepted' | 'rejected') {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  function handleClose() {
    setCloseError(null)
    startCloseTransition(async () => {
      const result = await updateOpportunityStatus(opportunity.id, 'closed')
      if (result?.error) setCloseError(result.error)
    })
  }

  return (
    <DashboardLayout title="فرصي التطوعية" role="org">
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 text-[13px] mb-4 flex-row-reverse justify-end"
        style={{ color: '#666666' }}
      >
        <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{opportunity.title}</span>
        <span>›</span>
        <Link href="/dashboard/opportunities" style={{ color: '#3C3489' }}>فرصي</Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex flex-col items-start gap-1">
          <button
            onClick={handleClose}
            disabled={isClosing || opportunity.status !== 'open'}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ border: '0.5px solid #A32D2D', color: '#A32D2D', backgroundColor: 'transparent' }}
          >
            {isClosing ? 'جاري الإغلاق...' : 'إغلاق الفرصة'}
          </button>
          {closeError && (
            <p className="text-[11px]" style={{ color: '#A32D2D' }} role="alert">{closeError}</p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-row-reverse">
          <h2 className="text-[20px] font-medium" style={{ color: '#1A1A1A' }}>{opportunity.title}</h2>
          <span
            className="text-[12px] font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: oppStyle.bg, color: oppStyle.color }}
          >
            {OPP_STATUS_LABELS[opportunity.status]}
          </span>
        </div>
      </div>

      {/* Global error / success */}
      {state.error && (
        <div
          role="alert"
          className="mb-4 rounded-lg px-4 py-3 text-[13px] text-right"
          style={{ backgroundColor: '#FCEBEB', color: '#A32D2D', border: '0.5px solid #F0CECE' }}
        >
          {state.error}
        </div>
      )}
      {state.success && (
        <div
          role="status"
          className="mb-4 rounded-lg px-4 py-3 text-[13px] text-right"
          style={{ backgroundColor: '#E1F5EE', color: '#0F6E56', border: '0.5px solid #B6E8D5' }}
        >
          تم حفظ التغييرات بنجاح
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-row-reverse gap-0 mb-6" style={{ borderBottom: '0.5px solid #E5E5E5' }}>
        <TabButton
          label="تفاصيل الفرصة"
          active={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
        />
        <TabButton
          label={`المتقدمون (${applicants.length})`}
          active={activeTab === 'applicants'}
          onClick={() => setActiveTab('applicants')}
        />
      </div>

      {/* Tab 1 — Details */}
      {activeTab === 'details' && (
        <form action={formAction} noValidate>
          <input type="hidden" name="required_skills" value={JSON.stringify(selectedSkills)} />
          <input type="hidden" name="time_slot"       value={timeSlot ?? 'flexible'} />
          <input type="hidden" name="status"          value={publishStatus} />

          <div className="bg-white rounded-2xl p-4 sm:p-6" style={{ border: '0.5px solid #E5E5E5' }}>
            <div className="space-y-6">

              <Field label="عنوان الفرصة" error={state.fieldErrors?.title}>
                <input
                  type="text"
                  name="title"
                  defaultValue={opportunity.title}
                  className="w-full px-4 py-2.5 rounded-lg text-[14px] text-right outline-none"
                  style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
                />
              </Field>

              <Field label="الوصف العام" error={state.fieldErrors?.description}>
                <textarea
                  name="description"
                  defaultValue={opportunity.description}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg text-[14px] text-right outline-none resize-none"
                  style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="الموقع (المدينة)">
                  <select
                    name="location"
                    defaultValue={opportunity.location}
                    className="w-full px-4 py-2.5 rounded-lg text-[14px] text-right outline-none appearance-none"
                    style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
                  >
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="التصنيف">
                  <select
                    name="category"
                    defaultValue={opportunity.category}
                    className="w-full px-4 py-2.5 rounded-lg text-[14px] text-right outline-none appearance-none"
                    style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="تاريخ الإنتهاء" error={state.fieldErrors?.end_date}>
                  <input
                    type="date"
                    name="end_date"
                    defaultValue={opportunity.end_date}
                    className="w-full px-4 py-2.5 rounded-lg text-[14px] outline-none"
                    style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
                  />
                </Field>
                <Field label="تاريخ البدء" error={state.fieldErrors?.start_date}>
                  <input
                    type="date"
                    name="start_date"
                    defaultValue={opportunity.start_date}
                    className="w-full px-4 py-2.5 rounded-lg text-[14px] outline-none"
                    style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A' }}
                  />
                </Field>
              </div>

              <Field label="المهارات المطلوبة">
                <div className="flex flex-wrap gap-2 justify-end">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: '#EEEDFE', color: '#3C3489', border: '0.5px solid #AFA9EC' }}
                    >
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`إزالة ${skill}`}
                      >
                        <X size={11} aria-hidden="true" />
                      </button>
                      {skill}
                    </span>
                  ))}
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => setSelectedSkills((prev) => [...prev, skill])}
                      className="text-[12px] font-medium px-3 py-1.5 rounded-full transition-all duration-150 hover:bg-[#EEEDFE]"
                      style={{ backgroundColor: '#F6F2FA', color: '#474551', border: '0.5px solid #C8C4D3' }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="حالة الظهور">
                  <div className="grid grid-cols-2 gap-2">
                    {(['draft', 'open'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPublishStatus(s)}
                        aria-pressed={publishStatus === s}
                        className="py-2.5 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all duration-150"
                        style={{
                          backgroundColor: publishStatus === s ? '#EEEDFE' : '#F6F2FA',
                          color:           publishStatus === s ? '#3C3489' : '#474551',
                          border:          publishStatus === s ? '1px solid #AFA9EC' : '0.5px solid #E5E5E5',
                        }}
                      >
                        {publishStatus === s && <Check size={13} aria-hidden="true" />}
                        {s === 'draft' ? 'مسودة' : 'منشورة الآن'}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="التوقيت المفضل">
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { v: 'morning', l: 'صباحي' },
                      { v: 'afternoon', l: 'مسائي' },
                    ] as { v: TimeSlot; l: string }[]).map(({ v, l }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setTimeSlot(v)}
                        aria-pressed={timeSlot === v}
                        className="py-2.5 rounded-lg text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all duration-150"
                        style={{
                          backgroundColor: timeSlot === v ? '#EEEDFE' : '#F6F2FA',
                          color:           timeSlot === v ? '#3C3489' : '#474551',
                          border:          timeSlot === v ? '1px solid #AFA9EC' : '0.5px solid #E5E5E5',
                        }}
                      >
                        {timeSlot === v && <Check size={13} aria-hidden="true" />}
                        {l}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <div
              className="flex items-center justify-between pt-4 mt-4"
              style={{ borderTop: '0.5px solid #E5E5E5' }}
            >
              <SaveButton />
              <span className="text-[12px]" style={{ color: '#787582' }}>
                أُنشئت: {formatDate(opportunity.created_at)}
              </span>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2 — Applicants */}
      {activeTab === 'applicants' && (
        <div>
          {applicants.length === 0 ? (
            <div className="text-center py-16 text-[14px]" style={{ color: '#666666' }}>
              لا يوجد متقدمون على هذه الفرصة بعد
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  onStatusChange={handleApplicantStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}