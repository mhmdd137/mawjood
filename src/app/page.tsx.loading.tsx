import { HeroSkeleton, CardSkeleton, StatCardSkeleton } from '@/components/skeletons/SharedSkeletons'

export default function HomeLoading() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full">
        <HeroSkeleton />
      </section>

      {/* Stats Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities Preview Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 space-y-2">
            <div className="h-8 w-48 bg-gray-300 rounded-lg animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} height="h-40" lines={4} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
