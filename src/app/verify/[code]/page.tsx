import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────


interface CertificateData {
  valid: boolean
  status?: 'active' | 'revoked'
  volunteer_name?: string
  org_name?: string
  opportunity_title?: string
  hours_logged?: number
  issue_date?: string
  verification_code?: string
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getCertificate(code: string): Promise<CertificateData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/verify/${code}`, { cache: 'no-store' })
    if (!res.ok) return { valid: false }
    return res.json()
  } catch {
    return { valid: false }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const data = await getCertificate(code)
  const isValid = data.valid && data.status === 'active'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4"
      style={{ backgroundColor: '#F6F2FA' }}
      dir="rtl"
    >
      <div className="w-full max-w-[560px] space-y-6">

        {/* Main Card */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: '0.5px solid #E5E5E5' }}
        >
          {/* Banner */}
          {isValid ? <ValidBanner /> : <InvalidBanner />}

          {/* Details — only if valid */}
          {isValid && data && (
            <div className="px-8 py-6">
              {/* Section title */}
              <div
                className="text-right text-[15px] font-medium mb-5"
                style={{ color: '#1A1A1A' }}
              >
                تفاصيل الشهادة
              </div>

              {/* Details rows */}
              <div className="space-y-4">
                <DetailRow label="اسم المتطوع" value={data.volunteer_name!} />
                <DetailRow
                  label="المنظمة المانحة"
                  value={
                    <div className="flex items-center gap-2 justify-end">
                      <span>{data.org_name}</span>
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: '#E1F5EE', color: '#0F6E56' }}
                      >
                        ✓ موثّقة
                      </span>
                    </div>
                  }
                />
                <DetailRow label="الفرصة التطوعية" value={data.opportunity_title!} />
                <DetailRow label="ساعات التطوع" value={`${data.hours_logged} ساعة`} />
                <DetailRow label="تاريخ الإصدار" value={data.issue_date!} />
                <DetailRow
                  label="رمز التحقق"
                  value={
                    <span
                      className="text-[12px] font-mono"
                      style={{ color: '#474551', direction: 'ltr', display: 'inline-block' }}
                    >
                      {code}
                    </span>
                  }
                />
              </div>

              <div
                className="mt-5 pt-5"
                style={{ borderTop: '0.5px solid #E5E5E5' }}
              />

              <Footer />
            </div>
          )}

          {/* Footer only for invalid */}
          {!isValid && (
            <div className="px-8 py-6">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ValidBanner() {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 px-6 text-center"
      style={{ backgroundColor: '#E1F5EE' }}
    >
      <div className="text-[40px] mb-2" style={{ color: '#0F6E56' }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="#0F6E56" strokeWidth="2" fill="none" />
          <path d="M14 24l7 7 13-13" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="text-[18px] font-medium mt-1" style={{ color: '#0F6E56' }}>
        شهادة موثّقة
      </div>
      <div className="text-[13px] mt-1" style={{ color: '#0F6E56' }}>
        تم التحقق من صحة هذه الشهادة
      </div>
    </div>
  )
}

function InvalidBanner() {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 px-6 text-center"
      style={{ backgroundColor: '#FCEBEB' }}
    >
      <div className="mb-2">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="#A32D2D" strokeWidth="2" fill="none" />
          <path d="M16 16l16 16M32 16L16 32" stroke="#A32D2D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-[18px] font-medium mt-1" style={{ color: '#A32D2D' }}>
        شهادة غير صالحة
      </div>
      <div className="text-[13px] mt-1" style={{ color: '#A32D2D' }}>
        لم يتم العثور على هذه الشهادة أو تم إلغاؤها
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | React.ReactNode
}) {
  return (
    <div
      className="flex items-center justify-between py-2"
      style={{ borderBottom: '0.5px solid #F0ECF4' }}
    >
      <div className="text-right">{value}</div>
      <div className="text-[13px] flex-shrink-0 mr-4" style={{ color: '#787582' }}>
        {label}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <ShieldCheck size={20} style={{ color: '#3C3489' }} />
      <p className="text-[13px]" style={{ color: '#666666' }}>
        صادرة عن منصة موجود — منصة التطوع في غزة
      </p>
      <Link
        href="/"
        className="text-[13px] font-medium flex items-center gap-1 transition-colors duration-150"
        style={{ color: '#3C3489' }}
      >
        ← زيارة المنصة
      </Link>
    </div>
  )
}