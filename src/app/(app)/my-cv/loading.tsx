// src/app/dashboard/upload/loading.tsx
export default function UploadLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb Placeholder */}
        <div className="h-4 w-32 bg-slate-200/60 rounded-md mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Left Column Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile/Info Card Skeleton */}
            <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm animate-pulse">
              <div className="h-16 w-16 bg-slate-200 rounded-2xl mb-6" />
              <div className="h-7 w-40 bg-slate-200 rounded-lg mb-3" />
              <div className="h-4 w-32 bg-slate-100 rounded-md" />
              <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
                <div className="h-3 w-full bg-slate-50 rounded" />
                <div className="h-3 w-2/3 bg-slate-50 rounded" />
              </div>
            </div>

            {/* Skills/Pro-tip Card Skeleton */}
            <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm animate-pulse">
              <div className="h-4 w-24 bg-slate-200 rounded mb-5" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-7 w-16 bg-slate-100 rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content / Right Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Large Content Card (Summary/Upload Area) */}
            <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm animate-pulse">
              <div className="h-6 w-32 bg-slate-200 rounded mb-6" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
              </div>
            </div>

            {/* List Item Skeleton (Experience/History) */}
            <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm animate-pulse">
              <div className="h-6 w-48 bg-slate-200 rounded mb-8" />
              {[1, 2].map((i) => (
                <div key={i} className="mb-8 flex gap-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                    <div className="h-3 w-1/4 bg-slate-100 rounded" />
                    <div className="h-16 w-full bg-slate-50 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
