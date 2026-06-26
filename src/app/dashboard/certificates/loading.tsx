// src/app/dashboard/certificates/loading.tsx
import { Skeleton, CertificateCardSkeleton } from '@/components/ui/Skeleton'

export default function CertificatesLoading() {
  return (
    <div className="space-y-5 p-6" dir="rtl">

      {/* Page title */}
      <Skeleton className="h-7 w-32" />

      {/* Certificate cards */}
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <CertificateCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
