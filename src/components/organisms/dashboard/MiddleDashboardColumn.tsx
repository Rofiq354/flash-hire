// src/components/organisms/dashboard/MiddleDashboardColumn.tsx

import { JobCard } from "@/components/molecules/JobCard";

export const MiddleDashboardColumn = ({
  jobs,
  cvData,
  userId,
  isSyncing,
}: any) => {
  return (
    <div className="col-span-12 xl:col-span-5 lg:col-span-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-foreground text-xl tracking-tight">
            Top Job Matches
          </h3>
          {!isSyncing && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {jobs.length} found
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isSyncing ? (
          // --- LOADING SKELETON (Synchronized with global.css) ---
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border-custom rounded-4xl p-6 h-50 animate-pulse shadow-sm"
              >
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-24 bg-muted/20 rounded-full" />
                  <div className="h-6 w-6 bg-muted/20 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-7 w-3/4 bg-muted/20 rounded-lg" />
                  <div className="h-4 w-1/2 bg-muted/10 rounded-lg" />
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="h-10 flex-1 bg-muted/10 rounded-xl" />
                  <div className="h-10 flex-1 bg-muted/10 rounded-xl" />
                </div>
              </div>
            ))}
          </>
        ) : jobs.length > 0 ? (
          jobs.map((job: any) => (
            <JobCard key={job.id} job={job} cvData={cvData} userId={userId} />
          ))
        ) : (
          <div className="text-center py-10 bg-card rounded-3xl border border-dashed border-border-custom">
            <p className="text-muted text-sm font-medium">
              No matching jobs found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
