// src/app/dashboard/upload/loading.tsx
export default function UploadLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto pt-12">
        {/* Header Skeleton - Centered */}
        <header className="mb-12 text-center animate-pulse">
          <div className="h-10 w-80 bg-slate-200 rounded-2xl mx-auto mb-3" />
          <div className="h-4 w-full max-w-xl bg-slate-100 rounded-lg mx-auto" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg mx-auto mt-2" />
        </header>

        {/* Grid Layout Skeleton (Matching DashboardInitial) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: UploadCard Skeleton (2 Columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-100 p-8 rounded-4xl shadow-sm animate-pulse">
              <div className="max-w-md mx-auto space-y-6">
                {/* Text Skeletons */}
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-slate-200 rounded-lg mx-auto" />
                  <div className="h-4 w-full bg-slate-100 rounded-md mx-auto" />
                </div>

                {/* Dropzone Skeleton */}
                <div className="h-64 w-full bg-slate-50 rounded-4xl border-2 border-dashed border-slate-100" />

                {/* Button Area placeholder */}
                <div className="h-12 w-32 bg-slate-100 rounded-2xl mx-auto" />
              </div>
            </div>
          </div>

          {/* Right: Pro Tip Skeleton (1 Column) */}
          <div className="space-y-6">
            <div className="bg-indigo-50/50 p-8 rounded-4xl border border-indigo-100 animate-pulse">
              {/* Icon placeholder */}
              <div className="h-12 w-12 bg-white rounded-2xl mb-4" />
              {/* Title */}
              <div className="h-5 w-24 bg-indigo-200/50 rounded-md mb-2" />
              {/* Description */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-indigo-100/50 rounded-md" />
                <div className="h-3 w-full bg-indigo-100/50 rounded-md" />
                <div className="h-3 w-3/4 bg-indigo-100/50 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
