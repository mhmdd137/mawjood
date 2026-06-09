'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { completeProfileAction } from '@/features/auth/actions/auth.actions'

const LOCATIONS  = ['غزة الشمالية', 'غزة', 'دير البلح', 'خانيونس', 'رفح'] as const
const SKILLS     = ['تمريض', 'إسعافات أولية', 'تدريس', 'دعم نفسي', 'لوجستيات', 'برمجة', 'تصميم', 'إدارة', 'طبخ', 'نقل'] as const
const TIME_SLOTS = [
  { value: 'morning',   label: 'صباحي' },
  { value: 'afternoon', label: 'مسائي' },
  { value: 'flexible',  label: 'مرن'   },
] as const

type Role = 'volunteer' | 'org'

type CompleteState = {
  error: string | null
  fieldErrors?: Partial<Record<'full_name' | 'location' | 'role', string[]>>
}

const initialState: CompleteState = { error: null }

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return <p className="mt-1 text-xs" style={{ color: '#A32D2D' }} role="alert">{messages[0]}</p>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full rounded-lg py-3 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-70"
      style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
    >
      {pending ? 'جاري الحفظ...' : 'إكمال التسجيل'}
    </button>
  )
}

export default function CompleteProfileForm() {
  const [role, setRole] = useState<Role | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [state, formAction] = useActionState(completeProfileAction, initialState)

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="skills"  value={JSON.stringify(selectedSkills)} />
      {role && <input type="hidden" name="role" value={role} />}

      <div className="space-y-5">
        <div className="text-right">
          <h2 className="text-lg font-medium" style={{ color: '#1A1A1A' }}>أكمل بياناتك</h2>
          <p className="text-sm mt-0.5" style={{ color: '#666666' }}>نحتاج بعض المعلومات لإعداد حسابك</p>
        </div>

        {/* Error */}
        {state.error && (
          <div role="alert" className="rounded-lg px-4 py-3 text-sm text-right" style={{ backgroundColor: '#FCEBEB', color: '#A32D2D', border: '0.5px solid #F0CECE' }}>
            {state.error}
          </div>
        )}

        {/* Full name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium mb-1.5 text-right" style={{ color: '#1A1A1A' }}>
            الاسم الكامل
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            aria-invalid={!!state.fieldErrors?.full_name}
            className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none"
            style={{ border: '0.5px solid #E5E5E5', backgroundColor: 'white', color: '#1A1A1A' }}
          />
          <FieldError messages={state.fieldErrors?.full_name} />
        </div>

        {/* Role */}
        <div>
          <p className="block text-sm font-medium mb-2 text-right" style={{ color: '#1A1A1A' }}>نوع الحساب</p>
          <div className="grid grid-cols-2 gap-3">
            {(['volunteer', 'org'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={role === r}
                className="rounded-xl py-3 text-sm font-medium transition-colors duration-150"
                style={{
                  backgroundColor: role === r ? '#EEEDFE' : 'white',
                  color:           role === r ? '#3C3489' : '#666666',
                  border:          role === r ? '0.5px solid #3C3489' : '0.5px solid #E5E5E5',
                }}
              >
                {r === 'volunteer' ? 'متطوع' : 'منظمة'}
              </button>
            ))}
          </div>
          <FieldError messages={state.fieldErrors?.role} />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5 text-right" style={{ color: '#1A1A1A' }}>
            الموقع
          </label>
          <select
            id="location"
            name="location"
            aria-invalid={!!state.fieldErrors?.location}
            className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none appearance-none"
            style={{ border: '0.5px solid #E5E5E5', backgroundColor: 'white', color: '#1A1A1A' }}
          >
            <option value="">اختر موقعك</option>
            {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <FieldError messages={state.fieldErrors?.location} />
        </div>

        {/* Skills — volunteer only */}
        {role === 'volunteer' && (
          <div>
            <p className="block text-sm font-medium mb-2 text-right" style={{ color: '#1A1A1A' }}>مهاراتك</p>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    aria-pressed={isSelected}
                    className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                    style={{
                      backgroundColor: isSelected ? '#EEEDFE' : 'white',
                      color:           isSelected ? '#3C3489' : '#666666',
                      border:          isSelected ? '0.5px solid #3C3489' : '0.5px solid #E5E5E5',
                    }}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Time slot — volunteer only */}
        {role === 'volunteer' && (
          <div>
            <p className="block text-sm font-medium mb-2 text-right" style={{ color: '#1A1A1A' }}>وقت التطوع المفضّل</p>
            <div className="flex gap-2">
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot.value}
                  className="flex-1 flex items-center justify-center rounded-lg py-2.5 text-xs font-medium cursor-pointer transition-colors duration-150"
                  style={{ border: '0.5px solid #E5E5E5' }}
                >
                  <input type="radio" name="time_slot" value={slot.value} className="sr-only peer" />
                  <span className="peer-checked:text-indigo-800" style={{ color: '#666666' }}>{slot.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <SubmitButton />
      </div>
    </form>
  )
}