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
          <h3 className="font-bold text-slate-900 text-xl tracking-tight">
            Top Job Matches
          </h3>
          {!isSyncing && (
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {jobs.length} found
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isSyncing ? (
          // --- LOADING SKELETON ---
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-4xl p-6 h-50 animate-pulse shadow-sm"
              >
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-24 bg-slate-100 rounded-full" />{" "}
                  {/* Badge Score */}
                  <div className="h-6 w-6 bg-slate-100 rounded-full" />{" "}
                  {/* Save Button */}
                </div>
                <div className="space-y-3">
                  <div className="h-7 w-3/4 bg-slate-100 rounded-lg" />{" "}
                  {/* Title */}
                  <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />{" "}
                  {/* Company/Loc */}
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="h-10 flex-1 bg-slate-50 rounded-xl" />{" "}
                  {/* Button 1 */}
                  <div className="h-10 flex-1 bg-slate-50 rounded-xl" />{" "}
                  {/* Button 2 */}
                </div>
              </div>
            ))}
          </>
        ) : jobs.length > 0 ? (
          // --- TAMPILKAN DATA ASLI JIKA TIDAK LOADING ---
          jobs.map((job: any) => (
            <JobCard key={job.id} job={job} cvData={cvData} userId={userId} />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">No matching jobs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
