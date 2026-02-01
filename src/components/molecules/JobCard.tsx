"use client";

// src/components/molecules/JobCard.tsx

import { useState } from "react";
import { Button } from "../atoms/Button";
import { AnalysisModal } from "./AnalysisModal";
import { getJobAnalysis } from "@/app/(app)/actions/job-actions";

interface AnalysisResult {
  score: number;
  match_reasons: string[];
  missing_skills: string[];
  advice: string;
}

interface JobCardProps {
  job: any;
  cvData?: any;
}

export const JobCard = ({ job, cvData }: JobCardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const cleanTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Position";

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
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
    <div className="border border-slate-100 rounded-3xl p-6 bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        {score !== null && (
          <div
            className={`px-3 py-1 rounded-full text-white text-[10px] font-bold ${getStatusColor(
              score,
            )}`}
          >
            {score === null ? "Not analyzed" : `${score}% Match`}
          </div>
        )}

        <span>{formatDate(job.postedDate)}</span>
      </div>

      <h3 className="font-bold text-lg leading-tight group-hover:text-indigo-600 transition-colors mb-1">
        {cleanTitle}
      </h3>

      <p className="text-sm text-slate-500 mb-4">
        {job.company?.display_name || "Confidential Company"}
      </p>

      <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-6">
        <div className="flex items-center gap-1">
          <span>📍</span>
          {job.location?.display_name || "Remote"}
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <span>💰</span>
          {job.salary_min
            ? `${job.salary_currency || "$"}${Math.round(
                job.salary_min,
              ).toLocaleString()}`
            : "Negotiable"}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-1 py-3 text-xs font-bold rounded-2xl"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Match"}
        </Button>

        <Button
          variant="primary"
          className="flex-1 py-3 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          onClick={() => window.open(job.redirect_url, "_blank")}
        >
          Apply
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
