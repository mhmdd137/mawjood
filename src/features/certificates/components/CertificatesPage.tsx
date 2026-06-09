'use client'

import { useState, useTransition } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Download, Copy, Check, Award } from 'lucide-react'
import Link from 'next/link'
import { getCertificateDownloadUrl } from '@/features/certificates/actions/certificates.actions'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Certificate {
  id: string
  file_path: string
  hours_logged: number
  issue_date: string
  status: 'active' | 'revoked'
  verification_code: string
  opportunity: {
    title: string
    category: string
  }
  org: {
    full_name: string
  }
}

interface Props {
  certificates: Certificate[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  طبي:        '➕',
  تعليمي:     '📚',
  لوجستي:     '🚛',
  'دعم نفسي': '🧠',
  تقني:       '💻',
  إغاثي:      '🎗️',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ value, label, valueColor }: { value: string; label: string; valueColor: string }) {
  return (
    <div
      className="rounded-xl p-5 text-center"
      style={{ backgroundColor: '#FFFFFF', border: '0.5px solid #E5E5E5' }}
    >
      <div className="text-[22px] font-medium leading-none" style={{ color: valueColor }}>
        {value}
      </div>
      <div className="text-[13px] mt-2" style={{ color: '#666666' }}>{label}</div>
    </div>
  )
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const icon = CATEGORY_ICONS[certificate.opportunity.category] ?? '📋'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin

  function handleCopy() {
    const url = `${appUrl}/verify/${certificate.verification_code}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    setDownloadError(null)
    startTransition(async () => {
      const result = await getCertificateDownloadUrl(certificate.file_path)
      if (result?.error) {
        setDownloadError(result.error)
        return
      }
      if (result?.url) {
        window.open(result.url, '_blank', 'noopener,noreferrer')
      }
    })
  }

  return (
    <div
      className="bg-white rounded-xl p-5 flex flex-col-reverse sm:flex-row items-start justify-between gap-4"
      style={{
        border: '0.5px solid #E5E5E5',
        borderRight: certificate.status === 'active' ? '3px solid #3C3489' : '3px solid #A32D2D',
      }}
    >
      {/* Left — actions */}
      <div className="flex flex-col gap-2 items-start flex-shrink-0">
        <button
          onClick={handleDownload}
          disabled={isPending || certificate.status === 'revoked'}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#EEEDFE', color: '#3C3489', borderColor: '#AFA9EC', borderWidth: '0.5px' }}
        >
          <Download size={14} aria-hidden="true" />
          {isPending ? 'جاري التحضير...' : 'تحميل الشهادة'}
        </button>

        {downloadError && (
          <p className="text-[11px]" style={{ color: '#A32D2D' }} role="alert">{downloadError}</p>
        )}

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[12px] transition-colors duration-150"
          style={{ color: copied ? '#0F6E56' : '#787582' }}
        >
          {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
          {copied ? 'تم النسخ' : 'نسخ رابط المشاركة'}
        </button>
      </div>

      {/* Right — info */}
      <div className="flex items-start gap-4 flex-row-reverse text-right">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[18px] flex-shrink-0"
          style={{ backgroundColor: '#F6F2FA' }}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div>
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full mb-2"
            style={
              certificate.status === 'active'
                ? { backgroundColor: '#E1F5EE', color: '#0F6E56' }
                : { backgroundColor: '#FCEBEB', color: '#A32D2D' }
            }
          >
            {certificate.status === 'active' ? '✓ موثّقة' : '✗ ملغاة'}
          </span>

          <p className="text-[15px] font-medium" style={{ color: '#1A1A1A' }}>
            {certificate.opportunity.title}
          </p>

          <div className="flex flex-col gap-1 mt-1.5">
            <span className="text-[13px]" style={{ color: '#666666' }}>
              🏢 {certificate.org.full_name}
            </span>
            <span className="text-[13px]" style={{ color: '#666666' }}>
              {certificate.hours_logged} ساعة تطوع
            </span>
            <span className="text-[12px]" style={{ color: '#787582' }}>
              صدرت: {formatDate(certificate.issue_date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CertificatesPage({ certificates }: Props) {
  const totalHours  = certificates.reduce((sum, c) => sum + c.hours_logged, 0)
  const activeCount = certificates.filter((c) => c.status === 'active').length

  return (
    <DashboardLayout title="شهاداتي" role="volunteer">
      <div dir="rtl">
        {/* Header */}
        <div className="text-right mb-6">
          <h2 className="text-[22px] font-medium" style={{ color: '#1A1A1A' }}>شهاداتي</h2>
          <p className="text-[14px] mt-1" style={{ color: '#666666' }}>
            شهادات تطوعك الموثّقة والقابلة للمشاركة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard value={`${certificates.length}`}  label="إجمالي الشهادات"       valueColor="#1A1A1A" />
          <StatCard value={`${totalHours} ساعة`}      label="إجمالي ساعات التطوع"   valueColor="#1A1A1A" />
          <StatCard value={`${activeCount} موثّقة`}   label="شهادات سارية"          valueColor="#0F6E56" />
        </div>

        {/* List */}
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#E5E1E9' }}
            >
              <Award size={24} style={{ color: '#787582' }} aria-hidden="true" />
            </div>
            <p className="text-[14px] mb-4" style={{ color: '#666666' }}>
              لم تحصل على أي شهادة بعد
            </p>
            <p className="text-[13px] mb-6" style={{ color: '#9CA3AF' }}>
              أكمل تطوعك لتحصل على شهاداتك
            </p>
            <Link
              href="/opportunities"
              className="px-6 py-2.5 rounded-lg text-[13px] font-medium text-white transition-all duration-150"
              style={{ backgroundColor: '#D85A30' }}
            >
              استكشف الفرص
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}