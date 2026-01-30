// src/components/molecules/JobCard.tsx

import { Button } from "../atoms/Button";

interface JobCardProps {
  job: any;
  cvData?: any;
}
export const JobCard = ({ job, cvData }: JobCardProps) => {
  // Logic sederhana untuk indikator warna (nanti diisi score real dari AI)
  const score = job.match_score || 0;
  const getStatusColor = (s: number) => {
    if (s >= 80) return "bg-emerald-500";
    if (s >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="border border-border-custom rounded-2xl p-5 bg-card hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(score)}`}
        >
          {score}% Match
        </div>
        <span className="text-xs text-muted italic">Posted: {job.created}</span>
      </div>

      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
        {job.title}
      </h3>
      <p className="text-sm text-slate-600 mb-4">{job.company.display_name}</p>

      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <span>📍 {job.location.display_name}</span>
        <span>•</span>
        <span>
          💰 {job.salary_min ? `IDR ${job.salary_min}` : "Negotiable"}
        </span>
      </div>

      <Button variant="primary" className="py-2 text-sm">
        View Details & AI Analysis
      </Button>
    </div>
  );
};
