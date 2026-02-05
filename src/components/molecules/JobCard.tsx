// components/molecules/JobCard.tsx
"use client";

import { useState } from "react";
import { Button, LinkButton } from "../atoms/Button";
import { NormalizedJob } from "@/lib/jobs/normalizeAzunaJob";
import { MapPin, Briefcase, Target } from "lucide-react";
import { SaveJobButton } from "../atoms/SaveJobButton";
import { AnalysisModal } from "./AnalysisModal";

interface JobCardProps {
  job: NormalizedJob & { matchScore?: number };
  cvData?: any;
  userId?: string;
}

export const JobCard = ({ job, cvData, userId }: JobCardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const cleanTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Position";

  const matchScore = job.matchScore ?? null;

  // Penentuan warna badge berdasarkan score
  const getScoreStyles = (score: number) => {
    if (score >= 75) return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (score >= 50) return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-red-50 text-red-600 border-red-100";
  };

  const handleAnalyze = async () => {
    if (!cvData || !userId) {
      alert("Please login and upload your CV first");
      return;
    }

    try {
      setIsAnalyzing(true);
      setShowModal(true);

      const response = await fetch("/api/analysis/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: job.description,
          userCV: cvData.parsed_data,
          jobId: job.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAnalysisResult(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisResult({
        overall_score: 0,
        strengths: ["Analysis failed"],
        weaknesses: [],
        overall_advice: "Unable to analyze this job at the moment.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-card border border-border-custom rounded-4xl p-6 hover:shadow-lg transition-all relative group h-full flex flex-col justify-between">
      <div>
        {/* Top Section: Match Score Badge & Save */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            {matchScore !== null && (
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getScoreStyles(matchScore)}`}
              >
                <Target className="inline h-3 w-3 mr-1" />
                {matchScore}% Match
              </span>
            )}
            <span className="px-3 py-1 bg-slate-100 text-muted text-[10px] font-bold rounded-full uppercase tracking-wider">
              {job.contractType || "Full-time"}
            </span>
          </div>
          <SaveJobButton job={job} userId={userId} variant="minimal" />
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

        {matchScore !== null && (
          <div className="mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Quick Match
              </p>
              <span
                className={`text-xs font-bold ${matchScore >= 75 ? "text-emerald-600" : matchScore >= 50 ? "text-amber-600" : "text-red-600"}`}
              >
                {matchScore >= 75
                  ? "Strong"
                  : matchScore >= 50
                    ? "Moderate"
                    : "Weak"}
              </span>
            </div>

            {analysisResult ? (
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-800">
                  {analysisResult.strengths[0] || "Good match for this role"}
                </p>
                {analysisResult.missing_skills.critical?.length > 0 && (
                  <p className="text-xs text-muted">
                    Missing:{" "}
                    <span className="text-red-600 font-medium">
                      {analysisResult.missing_skills.critical
                        .slice(0, 2)
                        .join(", ")}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Click "Analyze" for detailed skill gap analysis
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <LinkButton
          href={`${job.url}`}
          target="_blank"
          variant="primary"
          className="flex-1 rounded-xl py-2.5 text-sm font-bold"
          showLoadingOnClick
        >
          View Details
        </LinkButton>
        <Button
          variant="outline"
          className="flex-1 rounded-xl py-2.5 text-sm font-bold"
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
          disabled={!cvData || !userId}
        >
          {analysisResult ? "Re-analyze" : "Analyze"}
        </Button>
      </div>

      {/* Analysis Modal */}
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
