// Shared Skeleton Components for all loading states

/**
 * CardSkeleton: A reusable skeleton for card components
 * Used for opportunity cards, application cards, etc.
 */
export function CardSkeleton({
  height = 'h-32',
  lines = 3,
}: {
  height?: string;
  lines?: number;
} = {}) {
  return (
    <div
      className={`${height} bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3 animate-pulse shadow-sm`}
    >
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded-md ${i === 0 ? 'w-3/4' : i === 1 ? 'w-1/2' : 'w-2/3'}`}
        />
      ))}
    </div>
  );
}

/**
 * TableRowSkeleton: A reusable skeleton for table rows
 * Used for admin pages with data tables
 */
export function TableRowSkeleton({
  columns = 4,
}: {
  columns?: number;
} = {}) {
  return (
    <div className="h-16 bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded-md ${
            i === 0 ? 'flex-1 w-1/4' : i === 1 ? 'flex-1 w-1/3' : 'flex-1 w-1/5'
          }`}
        />
      ))}
    </div>
  );
}

/**
 * ProfileHeaderSkeleton: A reusable skeleton for profile headers
 * Used for public profile pages
 */
export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-start gap-5 flex-row-reverse animate-pulse">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="h-6 w-1/3 bg-gray-200 rounded-md" />
        <div className="h-4 w-1/2 bg-gray-100 rounded-md" />
        <div className="flex gap-4 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-24 bg-gray-100 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * FormSkeleton: A reusable skeleton for form fields
 * Used for login, register, and other form pages
 */
export function FormSkeleton({ fields = 4 }: { fields?: number } = {}) {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded-md" />
          <div className="h-10 bg-gray-100 rounded-lg" />
        </div>
      ))}
      <div className="h-10 bg-gray-300 rounded-lg w-full" />
    </div>
  );
}

/**
 * ListItemSkeleton: A reusable skeleton for list items
 * Used for notifications, applications, and other lists
 */
export function ListItemSkeleton({
  withAvatar = false,
}: {
  withAvatar?: boolean;
} = {}) {
  return (
    <div className="h-16 bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 animate-pulse">
      {withAvatar && <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />}
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
        <div className="h-3 w-1/3 bg-gray-100 rounded-md" />
      </div>
      <div className="w-16 h-6 bg-gray-200 rounded-full flex-shrink-0" />
    </div>
  );
}

/**
 * HeroSkeleton: A reusable skeleton for hero sections
 * Used for landing/home pages
 */
export function HeroSkeleton() {
  return (
    <div className="w-full pt-20 pb-8 lg:pt-32 lg:pb-16 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="h-8 w-48 bg-gray-200 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-3 text-center">
          <div className="h-12 w-full max-w-2xl mx-auto bg-gray-200 rounded-lg" />
          <div className="h-12 w-3/4 max-w-2xl mx-auto bg-gray-200 rounded-lg" />
        </div>

        {/* Subtitle */}
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="h-5 w-full bg-gray-100 rounded-md" />
          <div className="h-5 w-5/6 bg-gray-100 rounded-md" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <div className="h-12 w-full sm:w-40 bg-gray-300 rounded-lg" />
          <div className="h-12 w-full sm:w-40 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * StatCardSkeleton: A reusable skeleton for stat cards
 * Used for dashboard stats
 */
export function StatCardSkeleton() {
  return (
    <div className="h-32 bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between animate-pulse shadow-sm">
      <div className="h-5 w-1/2 bg-gray-200 rounded-md" />
      <div className="h-10 w-1/4 bg-gray-300 rounded-md" />
    </div>
  );
}

/**
 * OpportunityDetailSkeleton: A reusable skeleton for opportunity detail pages
 * Used for individual opportunity detail views
 */
export function OpportunityDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-1/3 bg-gray-200 rounded-md" />

      {/* Hero section */}
      <div className="space-y-4">
        <div className="h-10 w-3/4 bg-gray-300 rounded-lg" />
        <div className="h-5 w-1/2 bg-gray-200 rounded-md" />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-1/3 bg-gray-200 rounded-md" />
              <div className="space-y-1">
                <div className="h-4 w-full bg-gray-100 rounded-md" />
                <div className="h-4 w-5/6 bg-gray-100 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * FilterBarSkeleton: A reusable skeleton for filter bars
 * Used for pages with filters
 */
export function FilterBarSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 flex-wrap animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 w-40 bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
}
