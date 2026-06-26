// app/dashboard/loading.tsx

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8 w-full max-w-7xl mx-auto">
      
      <div className="space-y-3">
        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-5 w-48 bg-gray-100 rounded-md animate-pulse"></div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="h-32 bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between animate-pulse shadow-sm"
          >
            <div className="h-5 w-1/2 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-1/4 bg-gray-300 rounded-md mt-4"></div>
          </div>
        ))}
      </div>

      {/* 3. القوائم السفلية (Skeleton for Opportunities & Applications Lists) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        <div className="space-y-4">
          <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div 
              key={`left-${i}`} 
              className="h-28 bg-gray-50 border border-gray-100 rounded-xl animate-pulse p-5 flex flex-col gap-3"
            >
              <div className="h-5 w-3/4 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-1/2 bg-gray-100 rounded-md"></div>
            </div>
          ))}
        </div>


        <div className="space-y-4">
          <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse mb-6"></div>
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={`right-${i}`} 
              className="h-16 bg-gray-50 border border-gray-100 rounded-xl animate-pulse p-4 flex items-center justify-between"
            >
              <div className="h-4 w-1/3 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}