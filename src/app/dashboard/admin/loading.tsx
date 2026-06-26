// src/app/dashboard/admin/loading.tsx
import {
  Skeleton,
  StatCardSkeleton,
  OrgVerificationCardSkeleton,
} from '@/components/ui/Skeleton'

export default function AdminLoading() {
  return (
    <div className="space-y-6 p-6" dir="rtl">

      {/* Page title */}
      <Skeleton className="h-7 w-32" />

      {/* Stats row (5 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Area chart */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-52 w-full rounded-lg" />
      </div>

      {/* Pending orgs section */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        {[1, 2, 3].map(i => (
          <OrgVerificationCardSkeleton key={i} />
        ))}
      </div>

      {/* Recent activity */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <div className="bg-white border border-[#E5E5E5] rounded-xl divide-y divide-[#E5E5E5]">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
