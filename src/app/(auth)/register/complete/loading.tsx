export default function CompleteProfileLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F6F2FA' }} dir="rtl">
      <div className="w-full max-w-md animate-pulse">
        <div className="text-center mb-8 space-y-2">
          <div className="h-8 w-32 bg-gray-300 rounded-lg mx-auto" />
          <div className="h-4 w-48 bg-gray-200 rounded-md mx-auto" />
        </div>
        <div className="bg-white rounded-2xl p-8" style={{ border: '0.5px solid #E5E5E5' }}>
          {/* Form title */}
          <div className="space-y-2 mb-6">
            <div className="h-6 w-32 bg-gray-300 rounded-lg" />
            <div className="h-4 w-48 bg-gray-200 rounded-md" />
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded-md" />
                <div className="h-10 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Submit button */}
          <div className="mt-6 h-10 bg-gray-300 rounded-lg w-full" />
        </div>
      </div>
    </div>
  )
}
