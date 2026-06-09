'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
      <div className="text-[#A32D2D] text-[16px] font-medium">حدث خطأ أثناء تحميل الإشعارات</div>
      <p className="text-[#666666] text-[14px]">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-[#3C3489] text-white rounded-lg text-[13px] font-medium"
      >
        حاول مرة أخرى
      </button>
    </div>
  )
}
