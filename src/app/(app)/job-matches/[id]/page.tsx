// src/app/(app)/job-matches/[id]/page.tsx
import { AnalyzeJobButton } from "@/components/atoms/AnalyzeJobButton";
import { SaveJobButton } from "@/components/atoms/SaveJobButton";
import { LinkButton } from "@/components/atoms/Button";
import { getJobDetails } from "@/lib/jobs/job-storage-adapted.service";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Building2, Calendar, DollarSign, Target } from "lucide-react";
import { calculateMatchScore } from "@/lib/jobs/matchScore";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  // Get job details
  const job = await getJobDetails(params.id, userId);
  if (!job) notFound();

  // Get user CV for match score calculation
  const userCv = userId
    ? await prisma.cvs.findUnique({
        where: { user_id: userId },
      })
    : null;

  // Calculate quick match score
  const matchScore = userCv?.skills
    ? calculateMatchScore(userCv.skills, `${job.title} ${job.description}`)
    : null;

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="min-h-screen bg-background px-4">
      <div className="mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-card border border-border-custom rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-card-foreground tracking-tight">
                {job.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-4 text-muted font-medium">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {job.company}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {job.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(job.postedDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>

              {/* Badges with Match Score */}
              <div className="mt-6 flex flex-wrap gap-2">
                {matchScore !== null && (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border ${getScoreColor(matchScore)}`}
                  >
                    <Target className="inline h-4 w-4 mr-1" />
                    {matchScore}% Match
                  </span>
                )}
                {job.locationType && (
                  <span className="px-3 py-1 bg-indigo-50 text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                    {job.locationType}
                  </span>
                )}
                {job.contractType && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {job.contractType}
                  </span>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="shrink-0">
              {userId && (
                <SaveJobButton job={job} userId={userId} variant="full" />
              )}
            </div>
          </div>

          {/* Salary Section */}
          {job.salary && (
            <div className="mt-8 p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Expected Salary
                </div>
                <div className="text-xl font-black text-emerald-900">
                  {job.salary.currency} {job.salary.min?.toLocaleString()} -{" "}
                  {job.salary.max?.toLocaleString()}
                  {job.salary.isPredicted && (
                    <span className="text-sm font-medium opacity-70 ml-2">
                      (Estimated)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch">
            <LinkButton
              href={job.url}
              className="flex-1 h-full justify-center"
              showLoadingOnClick
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply on Company Site
            </LinkButton>

            {userId && userCv && (
              <AnalyzeJobButton
                job={job}
                cvData={userCv.parsed_data}
                className="flex-1 h-full justify-center"
              />
            )}
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-card border border-border-custom rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
            Job Description
          </h2>
          <div
            className="prose prose-slate max-w-none text-muted leading-relaxed
          prose-headings:text-card-foreground prose-strong:text-card-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>
      </div>
    </div>
  );
}
