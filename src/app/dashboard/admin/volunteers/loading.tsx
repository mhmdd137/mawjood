import DashboardLayout from '@/components/layout/DashboardLayout'

export default function AdminVolunteersLoading() {
  return (
    <DashboardLayout title="المتطوعون" role="admin">
      <div dir="rtl" className="animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="text-right space-y-1">
            <div className="h-7 w-48 bg-gray-300 rounded-lg" />
            <div className="h-4 w-40 bg-gray-200 rounded-md" />
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64 h-10 bg-gray-200 rounded-lg" />
        </div>

        {/* Grid of Volunteer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 flex flex-col gap-3"
              style={{ border: '0.5px solid #E5E5E5', borderRight: '3px solid #D1D5DB' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-row-reverse">
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-gray-200 rounded-md" />
                    <div className="h-3 w-20 bg-gray-100 rounded-md" />
                  </div>
                </div>

                {/* Count */}
                <div className="text-right flex-shrink-0">
                  <div className="h-6 w-8 bg-gray-300 rounded-lg" />
                  <div className="h-3 w-12 bg-gray-100 rounded-md mt-0.5" />
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 justify-end">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-5 w-16 bg-gray-100 rounded-full" />
                ))}
              </div>

              {/* Footer */}
              <div className="h-3 w-32 bg-gray-100 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
