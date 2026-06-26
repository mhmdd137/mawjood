export default function OpportunityDetailLoading() {
  return (
    <div dir="rtl" className="min-h-screen" style={{ background: "#FCFAFF" }}>
      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 mb-6 text-sm animate-pulse"
          style={{ color: "#666666" }}
        >
          <div className="h-4 w-16 bg-gray-200 rounded-md" />
          <span>←</span>
          <div className="h-4 w-20 bg-gray-200 rounded-md" />
          <span>←</span>
          <div className="h-4 w-32 bg-gray-300 rounded-md" />
        </div>

        <div className="flex gap-6 items-start">
          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col gap-5">
            {/* Block 1 — Header */}
            <div
              className="bg-white rounded-xl p-6 animate-pulse"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>

              <div className="h-8 w-3/4 bg-gray-300 rounded-lg mb-4" />

              <div className="flex items-center gap-2 justify-end mb-4">
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
                <div className="w-9 h-9 rounded-full bg-gray-200" />
              </div>

              <div className="flex items-center gap-4 justify-end text-sm flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="h-4 w-24 bg-gray-200 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Block 2 — Match Analysis */}
            <div
              className="bg-white rounded-xl p-5 animate-pulse"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-12 bg-gray-300 rounded-lg" />
                <div className="h-5 w-32 bg-gray-200 rounded-md" />
              </div>
              <div
                className="w-full rounded-full mb-4"
                style={{ height: "6px", background: "#E5E5E5" }}
              >
                <div
                  className="h-full rounded-full animate-pulse"
                  style={{ width: "65%", background: "#D1D5DB" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-end gap-2 animate-pulse"
                  >
                    <div className="h-3 w-16 bg-gray-200 rounded-md" />
                    <div className="h-4 w-24 bg-gray-200 rounded-md" />
                    <div className="w-4 h-4 rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Block 3 — About */}
            <div
              className="bg-white rounded-xl p-6 animate-pulse"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <div className="h-6 w-24 bg-gray-300 rounded-lg mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded-md" />
                <div className="h-4 w-5/6 bg-gray-200 rounded-md" />
                <div className="h-4 w-4/5 bg-gray-200 rounded-md" />
              </div>
            </div>

            {/* Block 4 — Skills */}
            <div
              className="bg-white rounded-xl p-6 animate-pulse"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <div className="h-6 w-24 bg-gray-300 rounded-lg mb-3" />
              <div className="flex flex-wrap gap-2 justify-end">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>

            {/* Block 5 — Similar Opportunities */}
            <div
              className="bg-white rounded-xl p-6 animate-pulse"
              style={{ border: "0.5px solid #E5E5E5" }}
            >
              <div className="h-6 w-32 bg-gray-300 rounded-lg mb-4" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-end gap-3 pb-3"
                    style={{ borderBottom: "0.5px solid #E5E5E5" }}
                  >
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-1" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-[300px] shrink-0">
            <div className="space-y-3 animate-pulse">
              <div className="h-12 bg-gray-300 rounded-lg w-full" />
              <div className="h-10 bg-gray-200 rounded-lg w-full" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
