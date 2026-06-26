// src/components/ui/Skeleton.tsx

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-[#E5E1E9] ${className}`}
    />
  )
}

// ─── Compound skeletons for reuse across loading files ──────────────────────

export function StatCardSkeleton() {
  return (
    <div className="bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg p-4 space-y-2">
      <Skeleton className="h-7 w-14" />
      <Skeleton className="h-3.5 w-28" />
    </div>
  )
}

export function OpportunityCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E5E5] border-r-[3px] border-r-[#AFA9EC] rounded-xl p-5 space-y-3">
      <div className="flex justify-between items-start gap-4">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-5 w-16 rounded-full shrink-0" />
      </div>
      <Skeleton className="h-4 w-44" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-1">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-10" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  )
}

export function ApplicationCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-3">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-20 rounded-full shrink-0" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function NotificationItemSkeleton() {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-[#E5E5E5]">
      <Skeleton className="h-2 w-2 rounded-full mt-2 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export function CertificateCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-3">
      <div className="flex justify-between items-start gap-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-16 rounded-full shrink-0" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function OrgVerificationCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-28 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  )
}
