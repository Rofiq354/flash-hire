import { JobCardSkeleton } from "@/components/molecules/JobCardSkeleton";

export default function Loading() {
  return (
    // Menggunakan bg-background sesuai global.css
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-360 mx-auto">
        {/* Header Skeleton */}
        <div className="mb-10 flex justify-between items-end animate-pulse">
          <div>
            {/* Menggunakan bg-muted dengan opacity untuk efek skeleton yang halus */}
            <div className="h-8 w-48 bg-muted/20 rounded-xl mb-2" />
            <div className="h-4 w-64 bg-muted/10 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-muted/20 rounded-xl" />
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column Skeleton */}
          <div className="col-span-12 xl:col-span-4 lg:col-span-6 space-y-6">
            <div className="h-100 bg-card rounded-4xl border border-border-custom animate-pulse shadow-sm" />
          </div>

          {/* Middle Column (Jobs) Skeleton */}
          <div className="col-span-12 xl:col-span-5 lg:col-span-6 space-y-4">
            <div className="h-6 w-32 bg-muted/20 rounded-lg mb-4" />
            {[...Array(3)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>

          {/* Right Column Skeleton */}
          <div className="col-span-12 xl:col-span-3">
            <div className="h-75 bg-card rounded-4xl border border-border-custom animate-pulse shadow-sm" />
          </div>
        </div>
      </div>
    </main>
  );
}
