export default function Loading() {
  return (
    <div className="p-6 animate-pulse" dir="rtl">
      <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white rounded-xl border border-gray-100" />
        ))}
      </div>
    </div>
  )
}
