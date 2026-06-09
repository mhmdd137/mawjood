'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { X, Send } from 'lucide-react'
import { createOpportunity } from '@/features/opportunities/actions/opportunities.actions'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['طبي', 'تعليمي', 'لوجستي', 'دعم نفسي', 'تقني', 'إغاثي'] as const
const LOCATIONS  = ['غزة الشمالية', 'غزة', 'دير البلح', 'خانيونس', 'رفح'] as const
const SKILLS     = ['تمريض', 'إسعافات أولية', 'تدريس', 'دعم نفسي', 'لوجستيات', 'برمجة', 'تصميم', 'إدارة', 'طبخ', 'نقل'] as const
const TIME_SLOTS = [
  { value: 'morning',   label: 'صباحي' },
  { value: 'afternoon', label: 'مسائي' },
  { value: 'flexible',  label: 'مرن'   },
] as const

type TimeSlot     = 'morning' | 'afternoon' | 'flexible'
type PublishStatus = 'draft' | 'open'

type ActionState = {
  error: string | null
  fieldErrors?: Partial<Record<
    'title' | 'description' | 'start_date' | 'end_date' | 'required_skills',
    string[]
  >>
}

const initialState: ActionState = { error: null }

// ─── Submit button ────────────────────────────────────────────────────────────

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium text-white transition-all duration-150 disabled:opacity-70"
      style={{ backgroundColor: '#D85A30' }}
    >
      <Send size={14} aria-hidden="true" />
      {pending ? 'جاري النشر...' : label}
    </button>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

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

// ─── Main component ───────────────────────────────────────────────────────────
interface Props {
  isVerified?: boolean
}


export default function NewOpportunityPage({ isVerified = true }: Props) {

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [timeSlot, setTimeSlot]             = useState<TimeSlot>('flexible')
  const [publishStatus, setPublishStatus]   = useState<PublishStatus>('open')
  const [state, formAction]                 = useActionState(createOpportunity, initialState)

  const availableSkills = SKILLS.filter((s) => !selectedSkills.includes(s))

  function removeSkill(skill: string) {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill))
  }

  function addSkill(skill: string) {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill])
    }
  }

  return (
      <DashboardLayout title="موجود" role="org">

    {/* تحذير المنظمات غير الموثقة */}
    {!isVerified && (
      <div
        role="alert"
        className="mb-5 rounded-lg px-4 py-3 text-sm text-right"
        style={{ backgroundColor: '#FAECE7', color: '#993C1D', border: '0.5px solid #F0CCB8' }}
      >
        ⚠️ حسابك قيد المراجعة — لا يمكنك نشر فرص حتى يتم توثيق منظمتك من قِبل الإدارة
      </div>
    )}

    {/* Breadcrumb */}

      <div className="flex items-center gap-2 text-[13px] mb-4 flex-row-reverse justify-end" style={{ color: '#666666' }}>
        <span style={{ color: '#1A1A1A', fontWeight: 500 }}>إضافة فرصة جديدة</span>
        <span>←</span>
        <Link href="/dashboard/opportunities" style={{ color: '#3C3489' }}>فرصي</Link>
      </div>

      <h2 className="text-[22px] font-medium text-right mb-6" style={{ color: '#1A1A1A' }}>
        إضافة فرصة جديدة
      </h2>

      {/* Global error */}
      {state.error && (
        <div
          role="alert"
          className="mb-5 rounded-lg px-4 py-3 text-[13px] text-right"
          style={{ backgroundColor: '#FCEBEB', color: '#A32D2D', border: '0.5px solid #F0CECE' }}
        >
          {state.error}
        </div>
      )}

      <form action={formAction} noValidate>
        {/* Hidden fields */}
        <input type="hidden" name="required_skills" value={JSON.stringify(selectedSkills)} />
        <input type="hidden" name="time_slot"       value={timeSlot} />
        <input type="hidden" name="status"          value={publishStatus} />

        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: '0.5px solid #E5E5E5' }}
        >
          <div className="space-y-6">

            {/* Title */}
            <Field label="عنوان الفرصة" error={state.fieldErrors?.title}>
              <input
                type="text"
                name="title"
                placeholder="مثال: مساعد طبي في العيادة المتنقلة"
                className="w-full px-4 py-2.5 rounded-lg text-[14px] text-right outline-none transition-all duration-150"
                style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A', backgroundColor: '#FFFFFF' }}
              />
            </Field>

            {/* Description */}
            <Field label="وصف الفرصة" error={state.fieldErrors?.description}>
              <textarea
                name="description"
                placeholder="اكتب وصفاً مفصلاً للمهام والمسؤوليات..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg text-[14px] text-right outline-none transition-all duration-150 resize-none"
                style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A', backgroundColor: '#FFFFFF' }}
              />
            </Field>

            {/* Category + Location */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="الموقع الجغرافي">
                <select
                  name="location"
                  defaultValue={LOCATIONS[1]}
                  className="w-full px-4 py-2.5 rounded-lg text-[14px] text-right outline-none appearance-none cursor-pointer"
                  style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A', backgroundColor: '#FFFFFF' }}
                >
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="التصنيف">
                <select
                  name="category"
                  defaultValue={CATEGORIES[0]}
                  className="w-full px-4 py-2.5 rounded-lg text-[14px] text-right outline-none appearance-none cursor-pointer"
                  style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A', backgroundColor: '#FFFFFF' }}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="تاريخ النهاية" error={state.fieldErrors?.end_date}>
                <input
                  type="date"
                  name="end_date"
                  className="w-full px-4 py-2.5 rounded-lg text-[14px] outline-none"
                  style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A', backgroundColor: '#FFFFFF' }}
                />
              </Field>
              <Field label="تاريخ البداية" error={state.fieldErrors?.start_date}>
                <input
                  type="date"
                  name="start_date"
                  className="w-full px-4 py-2.5 rounded-lg text-[14px] outline-none"
                  style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A', backgroundColor: '#FFFFFF' }}
                />
              </Field>
            </div>

            {/* Skills */}
            <Field label="المهارات المطلوبة" error={state.fieldErrors?.required_skills}>
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
                      <X size={12} aria-hidden="true" />
                    </button>
                    {skill}
                  </span>
                ))}
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all duration-150 hover:bg-[#EEEDFE]"
                    style={{ backgroundColor: '#F6F2FA', color: '#474551', border: '0.5px solid #C8C4D3' }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </Field>

            {/* Time Slot */}
            <Field label="التوقيت المتاح">
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setTimeSlot(slot.value)}
                    aria-pressed={timeSlot === slot.value}
                    className="py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150"
                    style={{
                      backgroundColor: timeSlot === slot.value ? '#EEEDFE' : '#F6F2FA',
                      color:           timeSlot === slot.value ? '#3C3489' : '#474551',
                      border:          timeSlot === slot.value ? '1px solid #AFA9EC' : '0.5px solid #E5E5E5',
                    }}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </Field>

            {/* Publish Status */}
            <Field label="حالة النشر">
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { value: 'draft', label: '🗒 مسودة'      },
                    { value: 'open',  label: '🌐 منشورة الآن' },
                  ] as { value: PublishStatus; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPublishStatus(opt.value)}
                    aria-pressed={publishStatus === opt.value}
                    className="py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150"
                    style={{
                      backgroundColor: publishStatus === opt.value ? '#EEEDFE' : '#F6F2FA',
                      color:           publishStatus === opt.value ? '#3C3489' : '#474551',
                      border:          publishStatus === opt.value ? '1px solid #AFA9EC' : '0.5px solid #E5E5E5',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>

          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between mt-8 pt-5"
            style={{ borderTop: '0.5px solid #E5E5E5' }}
          >
            <p className="text-[12px]" style={{ color: '#787582' }}>
              سيتم إشعار المتطوعين المناسبين تلقائياً
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/opportunities"
                className="px-5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150"
                style={{ border: '0.5px solid #C8C4D3', color: '#474551' }}
              >
                إلغاء
              </Link>
              <SubmitButton label="نشر الفرصة" />
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  )
}