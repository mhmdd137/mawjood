// src/app/dashboard/profile/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton'

export default function ProfileLoading() {
  return (
    <div className="space-y-6 p-6" dir="rtl">

      {/* Page title */}
      <Skeleton className="h-7 w-36" />

      <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 space-y-6">

        {/* Avatar upload area */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-3.5 w-52" />
          </div>
        </div>

        <div className="h-px bg-[#E5E5E5]" />

        {/* Form fields */}
        <div className="space-y-4">
          {/* Full name */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          {/* Location */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          {/* Bio */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          {/* Skills (volunteer only) */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Save button */}
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  )
}
