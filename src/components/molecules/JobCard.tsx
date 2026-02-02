"use client";

import { useState } from "react";
import { Button } from "../atoms/Button";
import { AnalysisModal } from "./AnalysisModal";
import { getJobAnalysis } from "@/app/(app)/actions/job-actions";
import { NormalizedJob } from "@/lib/jobs/normalizeAzunaJob";
import { Bookmark, MapPin, Briefcase, CheckCircle2 } from "lucide-react";

interface AnalysisResult {
  score: number;
  match_reasons: string[];
  missing_skills: string[];
  advice: string;
}

interface JobCardProps {
  job: NormalizedJob;
  cvData?: any;
}

export const JobCard = ({ job, cvData }: JobCardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const cleanTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Position";

  // Penentuan warna badge berdasarkan score
  const getScoreStyles = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-600";
    if (score >= 60) return "bg-amber-50 text-amber-600";
    return "bg-red-50 text-red-600";
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      setShowModal(true);
      const result = await getJobAnalysis(job.description, cvData);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Job analysis failed:", error);
      setAnalysisResult({
        score: 0,
        match_reasons: ["Analysis failed"],
        missing_skills: [],
        advice: "Unable to analyze this job at the moment.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const score = analysisResult?.score ?? null;

  return (
    <div className="bg-card border border-border-custom rounded-4xl p-6 hover:shadow-lg transition-all relative group h-full flex flex-col justify-between">
      <div>
        {/* Top Section: Badges & Save */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            {score !== null && (
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getScoreStyles(score)}`}
              >
                {score}% Match Score
              </span>
            )}
            <span className="px-3 py-1 bg-slate-100 text-muted text-[10px] font-bold rounded-full uppercase tracking-wider">
              {job.contractType || "Full-time"}
            </span>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="text-slate-400 hover:text-primary transition-colors focus:outline-none"
          >
            <Bookmark
              className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
            {cleanTitle}
          </h2>
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <span>{job.company}</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 capitalize">
              <Briefcase className="h-3.5 w-3.5" /> {job.locationType}
            </span>
          </div>
        </div>

        {/* AI Analysis Box - Hanya muncul jika sudah di-analyze */}
        {analysisResult ? (
          <div className="mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">
                {analysisResult.match_reasons[0] ||
                  "Matching with your profile"}
              </p>
              <p className="text-xs text-muted leading-relaxed">
                Missing:{" "}
                <span className="text-primary font-medium">
                  {analysisResult.missing_skills.join(", ") || "None"}
                </span>
              </p>
            </div>
          </div>
        ) : (
          /* Placeholder Box jika belum analyze agar layout tetap rapi */
          <div className="mt-5 bg-indigo-50/30 border border-dashed border-indigo-100 rounded-2xl p-4 flex items-center justify-center">
            <p className="text-xs text-indigo-400 font-medium">
              Click Analyze to see skill matching
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="primary"
          className="flex-1 rounded-xl py-2.5 text-sm font-bold"
          onClick={() => window.open(job.url, "_blank")}
        >
          View Details
        </Button>
        <Button
          variant="outline"
          className="flex-1 rounded-xl py-2.5 text-sm font-bold border-slate-200 bg-slate-50/50 hover:bg-slate-100"
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
        >
          Quick Apply
        </Button>
      </div>

      {showModal && (
        <AnalysisModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isLoading={isAnalyzing}
          data={analysisResult}
          jobTitle={cleanTitle}
        />
      )}
    </div>
  );
};
