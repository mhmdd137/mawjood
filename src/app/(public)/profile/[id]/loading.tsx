export default function PublicProfileLoading() {
  return (
    <div dir="rtl" className="min-h-screen" style={{ background: '#FCFAFF' }}>
      <main className="mx-auto max-w-[800px] px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm animate-pulse" style={{ color: '#666666' }}>
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
          <span>←</span>
          <div className="h-4 w-32 bg-gray-300 rounded-md" />
        </div>

        {/* Profile Content */}
        <div className="flex flex-col gap-5">
          {/* Header Card */}
          <div
            className="bg-white rounded-xl p-6 animate-pulse"
            style={{ border: '0.5px solid #E5E5E5' }}
          >
            <div className="flex items-start gap-5 flex-row-reverse">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />

              {/* Info */}
              <div className="flex-1 text-right space-y-3">
                <div className="flex items-center gap-2 justify-end mb-1 flex-wrap">
                  <div className="h-6 w-32 bg-gray-300 rounded-lg" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>

                <div className="flex items-center gap-4 justify-end flex-wrap">
                  <div className="h-4 w-32 bg-gray-200 rounded-md" />
                  <div className="h-4 w-28 bg-gray-200 rounded-md" />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4 space-y-2" style={{ borderTop: '0.5px solid #E5E5E5', paddingTop: '1rem' }}>
              <div className="h-4 w-full bg-gray-200 rounded-md" />
              <div className="h-4 w-5/6 bg-gray-200 rounded-md" />
              <div className="h-4 w-4/5 bg-gray-200 rounded-md" />
            </div>
          </div>

          {/* Verification Banner */}
          <div
            className="rounded-xl px-5 py-4 flex items-center justify-end gap-2 animate-pulse"
            style={{ backgroundColor: '#EEEDFE', border: '0.5px solid #AFA9EC' }}
          >
            <div className="flex-1 h-4 w-full bg-gray-300 rounded-md" />
            <div className="w-4 h-4 rounded-full bg-gray-300 flex-shrink-0" />
          </div>

          {/* Skills/Interests */}
          <div
            className="bg-white rounded-xl p-6 animate-pulse"
            style={{ border: '0.5px solid #E5E5E5' }}
          >
            <div className="h-6 w-24 bg-gray-300 rounded-lg mb-4" />
            <div className="flex flex-wrap gap-2 justify-end">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
              ))}
            </div>
          </div>

          {/* Applications/Activity */}
          <div
            className="bg-white rounded-xl p-6 animate-pulse"
            style={{ border: '0.5px solid #E5E5E5' }}
          >
            <div className="h-6 w-32 bg-gray-300 rounded-lg mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="pb-3"
                  style={{ borderBottom: '0.5px solid #E5E5E5' }}
                >
                  <div className="h-4 w-2/3 bg-gray-200 rounded-md mb-1" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
