'use client'

import { useState, useActionState, useRef, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  updateProfile,
  uploadAvatar,
  uploadSignature,
} from '@/features/profiles/actions/profiles.actions'
import imageCompression from 'browser-image-compression';

// ─── Constants ────────────────────────────────────────────────────────────────

const LOCATIONS = ['غزة الشمالية', 'غزة', 'دير البلح', 'خانيونس', 'رفح'] as const
const SKILLS = ['تمريض', 'إسعافات أولية', 'تدريس', 'دعم نفسي', 'لوجستيات', 'برمجة', 'تصميم', 'إدارة', 'طبخ', 'نقل'] as const
const TIME_SLOTS = [
  { value: 'morning', label: 'صباحي', icon: '☀️' },
  { value: 'afternoon', label: 'مسائي', icon: '🌙' },
  { value: 'flexible', label: 'مرن', icon: '🔄' },
] as const

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'volunteer' | 'org' | 'admin'
type TimeSlot = 'morning' | 'afternoon' | 'flexible'

export interface ProfileData {
  id: string
  full_name: string
  role: Role
  location: string
  bio: string
  skills: string[]
  time_slot: TimeSlot | null
  avatar_url: string | null
  email: string
  created_at: string
  is_verified: boolean
}

type UpdateProfileState = {
  error: string | null
  success: boolean
  fieldErrors?: Partial<Record<'full_name' | 'location' | 'bio', string[]>>
}

// ─── Submit button ────────────────────────────────────────────────────────────

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-70"
      style={{ backgroundColor: '#3C3489', border: '0.5px solid #26215C' }}
    >
      {pending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
    </button>
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

// ─── Avatar section ───────────────────────────────────────────────────────────

function AvatarSection({
  name,
  avatarUrl,
  onUpload,
}: {
  name: string
  avatarUrl: string | null
  onUpload: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(avatarUrl)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const initial = name.trim().charAt(0) || '؟'

async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0]
  if (!file) return

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    setUploadError('صيغة الملف غير مدعومة')
    return
  }

  setUploadError(null)
  setUploading(true)

  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  }

  try {
    const compressedFile = await imageCompression(file, options)
    setPreview(URL.createObjectURL(compressedFile))

    const formData = new FormData()
    formData.append('avatar', compressedFile)

    const result = await uploadAvatar(formData)

    if (result?.error) {
      setUploadError(result.error)
      setPreview(avatarUrl)
    }
    // ← حذفنا result?.signedUrl — الـ preview موجود من URL.createObjectURL
    // الـ signed URL الجديد بيجي تلقائياً عند refresh الصفحة من الـ layout
  } catch {
    setUploadError('حدث خطأ أثناء معالجة الصورة')
    setPreview(avatarUrl)
  } finally {
    setUploading(false)
  }
}

  return (
    <div
      className="rounded-xl p-5 text-right"
      style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium text-white flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: '#3C3489' }}
          aria-label={`صورة ${name}`}
        >
          {preview ? (
            <img src={preview} alt={name} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{name}</p>
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors duration-150 disabled:opacity-60"
          style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5', color: '#3C3489' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="17 8 12 3 7 8" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke="#3C3489" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {uploading ? 'جاري الرفع...' : 'تغيير الصورة'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label="رفع صورة الملف الشخصي"
          onChange={handleChange}
        />

        {uploadError && (
          <p className="text-xs" style={{ color: '#A32D2D' }} role="alert">{uploadError}</p>
        )}

        <p className="text-xs" style={{ color: '#9CA3AF' }}>JPG أو PNG · حتى 2MB</p>
      </div>
    </div>
  )
}

// ─── Account info section ─────────────────────────────────────────────────────

function AccountInfo({ profile }: { profile: ProfileData }) {
  const roleLabels: Record<Role, string> = {
    volunteer: 'متطوع',
    org: 'منظمة',
    admin: 'مدير',
  }
  const roleBadgeStyle: Record<Role, { bg: string; color: string }> = {
    volunteer: { bg: '#EEEDFE', color: '#3C3489' },
    org: { bg: '#E1F5EE', color: '#0F6E56' },
    admin: { bg: '#FAECE7', color: '#993C1D' },
  }
  const { bg, color } = roleBadgeStyle[profile.role]

  return (
    <div
      className="rounded-xl p-5 text-right"
      style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
    >
      <p className="text-sm font-medium mb-4" style={{ color: '#1A1A1A' }}>معلومات الحساب</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#1A1A1A' }}>{profile.email}</p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>البريد الإلكتروني</p>
        </div>
        <div className="h-px" style={{ backgroundColor: '#F0ECF4' }} />
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: '#1A1A1A' }}>
            {new Date(profile.created_at).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>تاريخ الانضمام</p>
        </div>
        <div className="h-px" style={{ backgroundColor: '#F0ECF4' }} />
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: bg, color }}
          >
            {roleLabels[profile.role]}
          </span>
          <p className="text-xs" style={{ color: '#9CA3AF' }}>نوع الحساب</p>
        </div>
      </div>
    </div>
  )
}

// ─── Signature upload — org only ──────────────────────────────────────────────

function SignatureUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('صيغة الملف غير مدعومة')
      return
    }
    if (file.size > 1 * 1024 * 1024) {
      setUploadError('حجم الملف يتجاوز 1MB')
      return
    }

    setUploadError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append('signature', file)
    const result = await uploadSignature(formData)

    setUploading(false)
    if (result?.error) {
      setUploadError(result.error)
    } else {
      setUploaded(true)
    }
  }

  return (
    <div>
      <p className="text-sm font-medium mb-1.5 text-right" style={{ color: '#1A1A1A' }}>
        توقيع المنظمة
      </p>
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm transition-colors duration-150 disabled:opacity-60"
        style={{ border: '0.5px dashed #C8C4D3', backgroundColor: '#F6F2FA', color: '#666666' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="17 8 12 3 7 8" stroke="#666" strokeWidth="1.5" strokeLinejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {uploading ? 'جاري الرفع...' : uploaded ? 'تم الرفع ✓' : 'رفع التوقيع'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="رفع توقيع المنظمة"
        onChange={handleChange}
      />
      {uploadError && (
        <p className="text-xs mt-1 text-right" style={{ color: '#A32D2D' }} role="alert">{uploadError}</p>
      )}
      <p className="text-xs mt-1 text-right" style={{ color: '#9CA3AF' }}>PNG شفاف مفضّل · حتى 1MB</p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const initialState: UpdateProfileState = { error: null, success: false }

interface Props {
  profile: ProfileData
}

export default function ProfilePage({ profile }: Props) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile.skills ?? [])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(profile.time_slot)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)
  const [state, formAction] = useActionState(updateProfile, initialState)

  function handleSkillToggle(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  return (
    <DashboardLayout role={profile.role} title="الإعدادات">
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="mb-6 text-right">
          <h1 className="text-lg font-medium" style={{ color: '#1A1A1A' }}>إعدادات الحساب</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666666' }}>
            قم بتخصيص ملفك الشخصي وتفضيلاتك المهنية
          </p>
        </div>

        {state.error && (
          <div
            role="alert"
            className="mb-5 rounded-lg px-4 py-3 text-sm text-right"
            style={{ backgroundColor: '#FCEBEB', color: '#A32D2D', border: '0.5px solid #F0CECE' }}
          >
            {state.error}
          </div>
        )}

        {state.success && (
          <div
            role="status"
            className="mb-5 rounded-lg px-4 py-3 text-sm flex items-center justify-end gap-2"
            style={{ backgroundColor: '#E1F5EE', color: '#0F6E56', border: '0.5px solid #B6E8D5' }}
          >
            <span>تم حفظ التغييرات بنجاح</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12l4 4L19 8" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        <div className="grid grid-cols-12 gap-5">
          {/* Left column */}
          <div className="col-span-4 flex flex-col gap-4">
            <AvatarSection
              name={profile.full_name}
              avatarUrl={avatarUrl}
              onUpload={setAvatarUrl}
            />
            <AccountInfo profile={profile} />
          </div>

          {/* Right column */}
          <div className="col-span-8">
            <form action={formAction} noValidate>
              <input type="hidden" name="skills" value={JSON.stringify(selectedSkills)} />
              <input type="hidden" name="time_slot" value={selectedTimeSlot ?? ''} />

              <div
                className="rounded-xl p-5 mb-4"
                style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
              >
                <p className="text-sm font-medium mb-4 text-right" style={{ color: '#1A1A1A' }}>
                  المعلومات الأساسية
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="full_name" className="block text-xs font-medium mb-1.5 text-right" style={{ color: '#666666' }}>
                      الاسم الكامل
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      defaultValue={profile.full_name}
                      autoComplete="name"
                      aria-invalid={!!state.fieldErrors?.full_name}
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-right outline-none transition-colors duration-150"
                      style={{ border: '0.5px solid #E5E5E5', backgroundColor: 'white', color: '#1A1A1A' }}
                    />
                    <FieldError messages={state.fieldErrors?.full_name} />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-xs font-medium mb-1.5 text-right" style={{ color: '#666666' }}>
                      الموقع الجغرافي
                    </label>
                    <select
                      id="location"
                      name="location"
                      defaultValue={profile.location}
                      aria-invalid={!!state.fieldErrors?.location}
                      className="w-full rounded-lg px-3 py-2.5 text-sm text-right outline-none transition-colors duration-150 appearance-none"
                      style={{ border: '0.5px solid #E5E5E5', backgroundColor: 'white', color: '#1A1A1A' }}
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <FieldError messages={state.fieldErrors?.location} />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-xs font-medium mb-1.5 text-right" style={{ color: '#666666' }}>
                    نبذة شخصية
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile.bio}
                    rows={3}
                    placeholder="اكتب نبذة قصيرة عن خبراتك ودوافعك للتطوع..."
                    aria-invalid={!!state.fieldErrors?.bio}
                    className="w-full rounded-lg px-3 py-2.5 text-sm text-right outline-none transition-colors duration-150 resize-none"
                    style={{ border: '0.5px solid #E5E5E5', backgroundColor: 'white', color: '#1A1A1A' }}
                  />
                  <FieldError messages={state.fieldErrors?.bio} />
                </div>
              </div>

              {profile.role === 'volunteer' && (
                <div
                  className="rounded-xl p-5 mb-4"
                  style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
                >
                  <p className="text-sm font-medium mb-1 text-right" style={{ color: '#1A1A1A' }}>المهارات</p>
                  <p className="text-xs mb-3 text-right" style={{ color: '#9CA3AF' }}>
                    اختر المهارات التي تبرع فيها لتسهيل مطابقتك مع الفرص
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => {
                      const isSelected = selectedSkills.includes(skill)
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          aria-pressed={isSelected}
                          className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                          style={{
                            backgroundColor: isSelected ? '#EEEDFE' : 'white',
                            color: isSelected ? '#3C3489' : '#666666',
                            border: isSelected ? '0.5px solid #3C3489' : '0.5px solid #E5E5E5',
                          }}
                        >
                          {isSelected && <span aria-hidden="true" className="mr-1">×</span>}
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {profile.role === 'volunteer' && (
                <div
                  className="rounded-xl p-5 mb-4"
                  style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
                >
                  <p className="text-sm font-medium mb-1 text-right" style={{ color: '#1A1A1A' }}>التوقيت المفضّل</p>
                  <p className="text-xs mb-3 text-right" style={{ color: '#9CA3AF' }}>متى يمكنك تقديم يد العون؟</p>
                  <div className="grid grid-cols-3 gap-3">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.value
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.value)}
                          aria-pressed={isSelected}
                          className="flex flex-col items-center gap-1.5 rounded-xl py-3 text-sm transition-colors duration-150"
                          style={{
                            backgroundColor: isSelected ? '#EEEDFE' : 'white',
                            border: isSelected ? '0.5px solid #3C3489' : '0.5px solid #E5E5E5',
                            color: isSelected ? '#3C3489' : '#666666',
                          }}
                        >
                          <span aria-hidden="true">{slot.icon}</span>
                          <span className="text-xs font-medium">{slot.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {profile.role === 'org' && (
                <div
                  className="rounded-xl p-5 mb-4"
                  style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
                >
                  <SignatureUpload />
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  {state.success ? 'آخر تحديث: منذ لحظات' : ''}
                </p>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}