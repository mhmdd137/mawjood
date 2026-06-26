import DashboardLayout from '@/components/layout/DashboardLayout'

export default function AdminOrgsLoading() {
  return (
    <DashboardLayout title="المنظمات" role="admin">
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

        {/* Grid of Org Cards */}
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
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-24 bg-gray-200 rounded-md" />
                    <div className="h-3 w-20 bg-gray-100 rounded-md" />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-gray-100 rounded-md" />
                <div className="h-3 w-5/6 bg-gray-100 rounded-md" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between flex-row-reverse pt-2" style={{ borderTop: '0.5px solid #F0ECF4' }}>
                <div className="h-3 w-32 bg-gray-100 rounded-md" />
                <div className="h-8 w-24 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
