'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[40vh] text-center" dir="rtl">
      <p className="text-sm font-medium mb-2" style={{ color: '#A32D2D' }}>
        حدث خطأ أثناء تحميل الفرص
      </p>
      <p className="text-xs mb-4" style={{ color: '#666666' }}>{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ backgroundColor: '#3C3489' }}
      >
        إعادة المحاولة
      </button>
    </div>
  )
}
