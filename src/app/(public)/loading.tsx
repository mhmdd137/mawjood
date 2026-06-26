import { CardSkeleton } from '@/components/skeletons/SharedSkeletons'

export default function PublicPageLoading() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-8 lg:pt-32 lg:pb-16 text-center px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="h-8 w-48 bg-gray-200 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="h-12 w-full max-w-2xl mx-auto bg-gray-300 rounded-lg" />
            <div className="h-12 w-3/4 max-w-2xl mx-auto bg-gray-300 rounded-lg" />
          </div>

          {/* Subtitle */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-5 w-full bg-gray-200 rounded-md" />
            <div className="h-5 w-5/6 bg-gray-200 rounded-md" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="h-12 w-full sm:w-40 bg-gray-300 rounded-lg" />
            <div className="h-12 w-full sm:w-40 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center rounded-2xl bg-white border border-gray-100 p-8 shadow-sm space-y-2">
              <div className="h-10 w-20 bg-gray-300 rounded-lg" />
              <div className="h-5 w-24 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      {/* Latest Opportunities */}
      <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10 animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-300 rounded-lg" />
            <div className="h-5 w-56 bg-gray-200 rounded-md" />
          </div>
          <div className="hidden sm:block h-5 w-20 bg-gray-200 rounded-md" />
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} height="h-40" lines={4} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white border-y border-gray-100 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-4 text-center">
                <div className="h-16 w-16 rounded-2xl bg-gray-200" />
                <div className="h-6 w-32 bg-gray-300 rounded-lg mx-auto" />
                <div className="space-y-1 w-full">
                  <div className="h-4 w-full bg-gray-200 rounded-md" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded-md mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 animate-pulse">
        <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-50/50 border border-indigo-100 px-6 py-16 text-center">
          <div className="h-10 w-64 bg-gray-300 rounded-lg mx-auto mb-4" />
          <div className="space-y-2 mb-8 max-w-2xl mx-auto">
            <div className="h-5 w-full bg-gray-200 rounded-md" />
            <div className="h-5 w-5/6 bg-gray-200 rounded-md mx-auto" />
          </div>
          <div className="h-12 w-40 bg-gray-300 rounded-lg mx-auto" />
        </div>
      </section>
    </div>
  )
}
