import { CardSkeleton } from '@/components/skeletons/SharedSkeletons'

export default function OpportunitiesLoading() {
  return (
    <div className="w-full min-h-screen" style={{ background: "#FCFAFF" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8" dir="rtl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded-md" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-8 w-full bg-gray-100 rounded-md" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 text-right">
              <div className="h-7 w-48 bg-gray-300 rounded-lg animate-pulse mb-1" />
              <div className="h-4 w-96 bg-gray-200 rounded-md animate-pulse" />
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} height="h-40" lines={4} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
