import { JobCardSkeleton } from "@/components/molecules/JobCardSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-360 mx-auto">
        {/* Header Skeleton */}
        <div className="mb-10 flex justify-between items-end animate-pulse">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded-xl mb-2" />
            <div className="h-4 w-64 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-xl" />
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column Skeleton */}
          <div className="col-span-12 xl:col-span-4 lg:col-span-6 space-y-6">
            <div className="h-100 bg-white rounded-4xl border border-slate-100 animate-pulse" />
          </div>

          {/* Middle Column (Jobs) Skeleton */}
          <div className="col-span-12 xl:col-span-5 lg:col-span-6 space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded-lg mb-4" />
            {[...Array(3)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>

          {/* Right Column Skeleton */}
          <div className="col-span-12 xl:col-span-3">
            <div className="h-75 bg-white rounded-4xl border border-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
