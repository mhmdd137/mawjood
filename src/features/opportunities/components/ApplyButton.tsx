'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createApplication } from '@/features/applications/actions/applications.actions'

interface Props {
  opportunityId: string
  isLoggedIn: boolean
  isVolunteer: boolean
  alreadyApplied: boolean
}

export default function ApplyButton({ opportunityId, isLoggedIn, isVolunteer, alreadyApplied }: Props) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  // مش مسجل → وديه لـ login
  if (!isLoggedIn) {
    return (
      <Link href="/login">
        <button
          className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-all duration-150 hover:opacity-90"
          style={{ background: '#D85A30', border: '1px solid #993C1D' }}
        >
          سجّل دخولك للتقديم
        </button>
      </Link>
    )
  }

  // مسجل بس مش متطوع (منظمة أو أدمن)
  if (!isVolunteer) {
    return (
      <button
        disabled
        className="w-full rounded-lg py-2.5 text-sm font-medium cursor-not-allowed"
        style={{ background: '#F0ECF4', color: '#9CA3AF' }}
      >
        متاح للمتطوعين فقط
      </button>
    )
  }

  // قدّم مسبقاً
  if (alreadyApplied || success) {
    return (
      <div
        className="w-full rounded-lg py-2.5 text-sm font-medium text-center"
        style={{ background: '#E1F5EE', color: '#0F6E56' }}
      >
        ✓ قدّمت على هذه الفرصة
      </div>
    )
  }

  function handleSubmit() {
    if (!message.trim()) {
      setError('يرجى كتابة رسالة تحفيزية')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await createApplication(opportunityId, message.trim())
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setOpen(false)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg py-2.5 text-sm font-medium text-white transition-all duration-150 hover:opacity-90"
        style={{ background: '#D85A30', border: '1px solid #993C1D' }}
      >
        قدّم الآن
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6 text-right"
            style={{ backgroundColor: 'white', border: '0.5px solid #E5E5E5' }}
            dir="rtl"
          >
            <h2 className="text-lg font-medium mb-1" style={{ color: '#1A1A1A' }}>التقديم على الفرصة</h2>
            <p className="text-sm mb-4" style={{ color: '#666666' }}>اكتب رسالة تعريفية تشرح دوافعك وخبراتك</p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="اكتب رسالتك هنا..."
              className="w-full rounded-lg px-4 py-3 text-sm text-right outline-none resize-none"
              style={{ border: '0.5px solid #C8C4D3', color: '#1A1A1A', backgroundColor: 'white' }}
            />

            {error && (
              <p className="text-xs mt-2" style={{ color: '#A32D2D' }} role="alert">{error}</p>
            )}

            <div className="flex items-center gap-3 mt-4 justify-start">
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-150 disabled:opacity-70"
                style={{ backgroundColor: '#D85A30', border: '0.5px solid #993C1D' }}
              >
                {isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{ border: '0.5px solid #C8C4D3', color: '#666666' }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}