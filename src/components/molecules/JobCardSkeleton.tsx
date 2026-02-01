// src/components/molecules/JobCardSkeleton.tsx
export const JobCardSkeleton = () => {
  return (
    <div className="border border-slate-100 rounded-3xl p-6 bg-white animate-pulse">
      <div className="flex justify-between items-start mb-4">
        {/* Match Power Badge Skeleton */}
        <div className="w-16 h-6 bg-slate-200 rounded-full" />
        {/* Date Skeleton */}
        <div className="w-20 h-3 bg-slate-100 rounded-lg" />
      </div>

      {/* Title Skeleton */}
      <div className="w-3/4 h-5 bg-slate-200 rounded-lg mb-2" />
      {/* Company Skeleton */}
      <div className="w-1/2 h-4 bg-slate-100 rounded-lg mb-4" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-24 h-3 bg-slate-100 rounded-lg" />
        <div className="w-24 h-3 bg-slate-100 rounded-lg" />
      </div>

      {/* Button Skeleton */}
      <div className="w-full h-10 bg-slate-100 rounded-2xl" />
    </div>
  );
};
