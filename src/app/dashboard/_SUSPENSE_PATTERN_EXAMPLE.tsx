
import { Suspense } from 'react'
import { StatCardSkeleton, OpportunityCardSkeleton } from '@/components/ui/Skeleton'

async function VolunteerStats() {

  return (
    <div className="grid grid-cols-3 gap-4">

    </div>
  )
}

async function MatchedOpportunities() {
  return (
    <div className="space-y-3">
    </div>
  )
}

// ─── Skeleton fallback مخصص للـ Stats ────────────────────────────────────
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  )
}

// ─── Skeleton fallback مخصص للـ Opportunities ────────────────────────────
function OpportunitiesSkeleton() {
  return (
    <div className="space-y-3">
      <OpportunityCardSkeleton />
      <OpportunityCardSkeleton />
      <OpportunityCardSkeleton />
    </div>
  )
}

// ─── الصفحة الرئيسية ─────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6" dir="rtl">
      <h1 className="text-[22px] font-medium text-[#1A1A1A]">الرئيسية</h1>


      <Suspense fallback={<StatsSkeleton />}>
        <VolunteerStats />
      </Suspense>

      <h2 className="text-[18px] font-medium text-[#1A1A1A]">الفرص المناسبة لك</h2>

      <Suspense fallback={<OpportunitiesSkeleton />}>
        <MatchedOpportunities />
      </Suspense>
    </div>
  )
}
