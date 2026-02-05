// src/components/organisms/dashboard/MiddleDashboardColumn.tsx
import { JobCard } from "@/components/molecules/JobCard";

interface MiddleDashboardColumnProps {
  jobs: any[];
  cvData: any;
  userId?: string;
}

export const MiddleDashboardColumn = ({
  jobs,
  cvData,
  userId,
}: MiddleDashboardColumnProps) => {
  return (
    <div className="col-span-12 xl:col-span-5 lg:col-span-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-900 text-xl tracking-tight">
            Top Job Matches
          </h3>
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            {jobs.length} found
          </span>
        </div>
        <button className="text-indigo-600 text-sm font-bold hover:underline transition-all">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} cvData={cvData} userId={userId} />
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">
              No matching jobs found for your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
