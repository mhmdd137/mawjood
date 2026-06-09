'use client'

import { useState, useActionState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { registerAction, signInWithGoogleAction, type RegisterState } from '../actions/auth.actions'

// ─── Constants ────────────────────────────────────────────────────────────────
const LOCATIONS = ['غزة الشمالية', 'غزة', 'دير البلح', 'خانيونس', 'رفح'] as const
const SKILLS = ['تمريض', 'إسعافات أولية', 'تدريس', 'دعم نفسي', 'لوجستيات', 'برمجة', 'تصميم', 'إدارة', 'طبخ', 'نقل'] as const
const TIME_SLOTS = [
  { value: 'morning', label: 'صباحي' },
  { value: 'afternoon', label: 'مسائي' },
  { value: 'flexible', label: 'مرن' },
] as const

type Role = 'volunteer' | 'org'
type Step = 1 | 2 | 3

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEP_LABELS: Record<Step, string> = {
  1: 'الدور',
  2: 'البيانات',
  3: 'تأكيد',
}

function StepIndicator({ current }: { current: Step }) {
  return (
    <nav aria-label="خطوات التسجيل" className="mb-8">
      <ol className="flex items-center gap-0 flex-row-reverse">
        {([1, 2, 3] as Step[]).map((step, index) => {
          const isActive = step === current
          const isDone = step < current
          return (
            <li key={step} className="flex items-center flex-1 flex-row-reverse">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-150"
                  style={{
                    backgroundColor: isActive ? '#3C3489' : isDone ? '#3C3489' : 'white',
                    color: isActive || isDone ? 'white' : '#9CA3AF',
                    border: isActive || isDone ? 'none' : '0.5px solid #E5E5E5',
                  }}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className="text-xs mt-1"
                  style={{ color: isActive ? '#3C3489' : '#9CA3AF' }}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
              {index < 2 && (
                <div
                  className="flex-1 h-px mx-2"
                  style={{ backgroundColor: step < current ? '#3C3489' : '#E5E5E5' }}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// ─── Field error ──────────────────────────────────────────────────────────────
function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return (
    <p className="mt-1 text-xs" style={{ color: '#A32D2D' }} role="alert">
      {messages[0]}
    </p>
  )
}

// ─── Submit button ────────────────────────────────────────────────────────────
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full rounded-lg py-3 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-70"
      style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
    >
      {pending ? 'جاري المعالجة...' : label}
    </button>
  )
}

// ─── Step 1 — Role selection ──────────────────────────────────────────────────
function StepRole({
  selected,
  onSelect,
  onNext,
}: {
  selected: Role | null
  onSelect: (r: Role) => void
  onNext: () => void
}) {
  const roles: { value: Role; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      value: 'volunteer',
      label: 'متطوع',
      desc: 'أريد تقديم وقتي ومهاراتي للمجتمع.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21C12 21 4 15.5 4 9.5A8 8 0 0 1 20 9.5C20 15.5 12 21 12 21Z" stroke="#3C3489" strokeWidth="1.5" />
          <path d="M9 10l2 2 4-4" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      value: 'org',
      label: 'منظمة',
      desc: 'نحن منظمة تبحث عن متطوعين لمبادراتنا.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="8" width="18" height="13" rx="1.5" stroke="#3C3489" strokeWidth="1.5" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="#3C3489" strokeWidth="1.5" />
          <path d="M9 13h6M9 16h4" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6 text-right">
        <h1 className="text-xl font-medium" style={{ color: '#1A1A1A' }}>
          كيف تريد الانضمام؟
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#666666' }}>
          اختر الدور الذي يناسبك في المنصة.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {roles.map((role) => {
          const isSelected = selected === role.value
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onSelect(role.value)}
              aria-pressed={isSelected}
              className="flex items-center gap-4 rounded-xl px-5 py-4 text-right transition-colors duration-150 w-full"
              style={{
                backgroundColor: isSelected ? '#EEEDFE' : 'white',
                border: isSelected ? '0.5px solid #3C3489' : '0.5px solid #E5E5E5',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: isSelected ? 'white' : '#F6F2FA' }}
              >
                {role.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                  {role.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#666666' }}>
                  {role.desc}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!selected}
        className="w-full rounded-lg py-3 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-40"
        style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
      >
        المتابعة
      </button>
    </div>
  )
}

// ─── Step 2 — Details ─────────────────────────────────────────────────────────
function StepDetails({
  role,
  fieldErrors,
  selectedSkills,
  onSkillToggle,
}: {
  role: Role
  fieldErrors: RegisterState['fieldErrors']
  selectedSkills: string[]
  onSkillToggle: (skill: string) => void
}) {
  return (
    <div>
      <div className="mb-6 text-right">
        <h1 className="text-xl font-medium" style={{ color: '#1A1A1A' }}>
          {role === 'volunteer' ? 'بياناتك الشخصية' : 'بيانات المنظمة'}
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#666666' }}>
          أكمل بياناتك لإنشاء حسابك.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Full name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium mb-1.5 text-right" style={{ color: '#1A1A1A' }}>
            {role === 'volunteer' ? 'الاسم الكامل' : 'اسم المنظمة'}
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete={role === 'volunteer' ? 'name' : 'organization'}
            aria-invalid={!!fieldErrors?.full_name}
            className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none transition-colors duration-150"
            style={{
              border: fieldErrors?.full_name ? '0.5px solid #A32D2D' : '0.5px solid #E5E5E5',
              backgroundColor: 'white',
              color: '#1A1A1A',
            }}
          />
          <FieldError messages={fieldErrors?.full_name} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-right" style={{ color: '#1A1A1A' }}>
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="example@email.com"
            aria-invalid={!!fieldErrors?.email}
            className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none transition-colors duration-150"
            style={{
              border: fieldErrors?.email ? '0.5px solid #A32D2D' : '0.5px solid #E5E5E5',
              backgroundColor: 'white',
              color: '#1A1A1A',
            }}
          />
          <FieldError messages={fieldErrors?.email} />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-right" style={{ color: '#1A1A1A' }}>
            كلمة المرور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!fieldErrors?.password}
            aria-describedby="password-hint"
            className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none transition-colors duration-150"
            style={{
              border: fieldErrors?.password ? '0.5px solid #A32D2D' : '0.5px solid #E5E5E5',
              backgroundColor: 'white',
              color: '#1A1A1A',
            }}
          />
          <p id="password-hint" className="mt-1 text-xs" style={{ color: '#9CA3AF' }}>
            8 أحرف على الأقل، حرف كبير ورقم
          </p>
          <FieldError messages={fieldErrors?.password} />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5 text-right" style={{ color: '#1A1A1A' }}>
            الموقع
          </label>
          <select
            id="location"
            name="location"
            aria-invalid={!!fieldErrors?.location}
            className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none transition-colors duration-150 appearance-none"
            style={{
              border: fieldErrors?.location ? '0.5px solid #A32D2D' : '0.5px solid #E5E5E5',
              backgroundColor: 'white',
              color: '#1A1A1A',
            }}
          >
            <option value="">اختر موقعك</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <FieldError messages={fieldErrors?.location} />
        </div>

        {/* Skills — volunteer only */}
        {role === 'volunteer' && (
          <div>
            <p className="block text-sm font-medium mb-2 text-right" style={{ color: '#1A1A1A' }}>
              مهاراتك
            </p>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => onSkillToggle(skill)}
                    aria-pressed={isSelected}
                    className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                    style={{
                      backgroundColor: isSelected ? '#EEEDFE' : 'white',
                      color: isSelected ? '#3C3489' : '#666666',
                      border: isSelected ? '0.5px solid #3C3489' : '0.5px solid #E5E5E5',
                    }}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
            {/* Hidden input to carry skills array */}
            <input
              type="hidden"
              name="skills"
              value={JSON.stringify(selectedSkills)}
            />
          </div>
        )}

        {/* Time slot — volunteer only */}
        {role === 'volunteer' && (
          <div>
            <p className="block text-sm font-medium mb-2 text-right" style={{ color: '#1A1A1A' }}>
              وقت التطوع المفضّل
            </p>
            <div className="flex gap-2">
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot.value}
                  className="flex-1 flex items-center justify-center rounded-lg py-2.5 text-sm cursor-pointer transition-colors duration-150"
                  style={{ border: '0.5px solid #E5E5E5' }}
                >
                  <input
                    type="radio"
                    name="time_slot"
                    value={slot.value}
                    className="sr-only peer"
                  />
                  <span
                    className="text-xs font-medium peer-checked:text-indigo-800"
                    style={{ color: '#666666' }}
                  >
                    {slot.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step 3 — Confirm ─────────────────────────────────────────────────────────
function StepConfirm({ role }: { role: Role }) {
  return (
    <div className="text-center py-4">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: '#EEEDFE' }}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l4 4L19 8" stroke="#3C3489" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-lg font-medium mb-2" style={{ color: '#1A1A1A' }}>
        مراجعة البيانات
      </h2>
      <p className="text-sm mb-6" style={{ color: '#666666' }}>
        {role === 'volunteer'
          ? 'اضغط "إنشاء الحساب" لإتمام التسجيل كمتطوع.'
          : 'سيتم مراجعة حساب منظمتك من قِبل الفريق قبل التفعيل.'}
      </p>
    </div>
  )
}

// ─── Google button ────────────────────────────────────────────────────────────
function GoogleButton() {
  const [isPending, startTransition] = useTransition()

  function handleGoogle() {
    startTransition(async () => {
      const result = await signInWithGoogleAction()
      if ('url' in result) {
        window.location.href = result.url
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={isPending}
      aria-busy={isPending}
      className="w-full flex items-center justify-center gap-3 rounded-lg py-3 text-sm font-medium transition-colors duration-150 disabled:opacity-70"
      style={{
        backgroundColor: 'white',
        border: '0.5px solid #E5E5E5',
        color: '#1A1A1A',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
        <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z" />
        <path fill="#FBBC05" d="M24 46c5.5 0 10.5-1.9 14.4-5l-6.7-5.5C29.8 37 27 38 24 38c-5.8 0-10.7-3.9-12.4-9.3l-7 5.4C8.1 41.2 15.5 46 24 46z" />
        <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.9 2.6-2.6 4.8-4.8 6.5l6.7 5.5C41.8 36.8 45 30.8 45 24c0-1.3-.2-2.7-.5-4z" />
      </svg>
      {isPending ? 'جاري التوجيه...' : 'التسجيل عبر Google'}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const initialState: RegisterState = { error: null }

export default function RegisterForm() {
  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<Role | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [state, formAction] = useActionState(registerAction, initialState)

  function handleSkillToggle(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  function handleNext() {
    if (step === 1 && role) setStep(2)
    else if (step === 2) setStep(3)
  }

  function handleBack() {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  return (
    <div>
      <StepIndicator current={step} />

      {/* Global error from server */}
      {state.error && (
        <div
          role="alert"
          className="mb-5 rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: '#FCEBEB',
            color: '#A32D2D',
            border: '0.5px solid #F0CECE',
          }}
        >
          {state.error}
        </div>
      )}

      <form action={formAction} noValidate>
        {/* Hidden role field — always submitted */}
        {role && <input type="hidden" name="role" value={role} />}

        {step === 1 && (
          <StepRole
            selected={role}
            onSelect={setRole}
            onNext={handleNext}
          />
        )}

        {step === 2 && role && (
          <>
            <StepDetails
              role={role}
              fieldErrors={state.fieldErrors}
              selectedSkills={selectedSkills}
              onSkillToggle={handleSkillToggle}
            />
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-lg py-3 text-sm font-medium transition-colors duration-150"
                style={{
                  backgroundColor: 'white',
                  border: '0.5px solid #E5E5E5',
                  color: '#666666',
                }}
              >
                رجوع
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-lg py-3 text-sm font-medium text-white transition-opacity duration-150"
                style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
              >
                المتابعة
              </button>
            </div>
          </>
        )}

        {step === 3 && role && (
          <>
            <StepConfirm role={role} />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-lg py-3 text-sm font-medium transition-colors duration-150"
                style={{
                  backgroundColor: 'white',
                  border: '0.5px solid #E5E5E5',
                  color: '#666666',
                }}
              >
                رجوع
              </button>
              <div className="flex-1">
                <SubmitButton label="إنشاء الحساب" />
              </div>
            </div>
          </>
        )}
      </form>

      {/* Divider + Google — Step 1 only */}
      {step === 1 && (
        <>
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E5E5' }} />
            <span className="text-xs" style={{ color: '#666666' }}>أو</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E5E5' }} />
          </div>
          <GoogleButton />
        </>
      )}

      <p className="mt-6 text-center text-sm" style={{ color: '#666666' }}>
        لديك حساب بالفعل؟{' '}
        <Link
          href="/login"
          className="font-medium transition-opacity duration-150 hover:opacity-80"
          style={{ color: '#3C3489' }}
        >
          سجّل دخولك
        </Link>
      </p>
    </div>
  )
}