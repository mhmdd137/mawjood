// src/app/dashboard/applications/loading.tsx
import { Skeleton, ApplicationCardSkeleton } from '@/components/ui/Skeleton'

export default function ApplicationsLoading() {
  return (
    <div className="space-y-5 p-6" dir="rtl">

      {/* Page title */}
      <Skeleton className="h-7 w-36" />

      {/* Status filter tabs */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>

      {/* Application cards */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <ApplicationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
