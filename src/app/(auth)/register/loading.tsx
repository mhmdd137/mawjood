export default function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F6F2FA' }} dir="rtl">
      <div className="w-full max-w-md animate-pulse">
        <div className="text-center mb-8 space-y-3">
          <div className="h-8 w-32 bg-gray-300 rounded-lg mx-auto" />
          <div className="h-4 w-48 bg-gray-200 rounded-md mx-auto" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 flex-row-reverse justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <span className="text-xs mt-1 h-3 w-8 bg-gray-100 rounded-md" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8" style={{ border: '0.5px solid #E5E5E5' }}>
          {/* Form fields */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded-md" />
                <div className="h-10 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Submit button */}
          <div className="mt-6 h-10 bg-gray-300 rounded-lg w-full" />

          {/* Google button */}
          <div className="mt-3 h-10 bg-gray-200 rounded-lg w-full" />
        </div>
      </div>
    </div>
  )
}
