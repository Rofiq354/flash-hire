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
  // 1. Inisialisasi state langsung dari data yang sudah ada (server-side)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(
    job.analysisResult || null, // Ambil data dari server jika ada
  );
  const [showModal, setShowModal] = useState(false);

  const cleanTitle = job.title?.replace(/<\/?[^>]+(>|$)/g, "") || "Position";
  const matchScore = job.matchScore ?? null;

  const handleAnalyze = async () => {
    // 2. LOGIK ZERO-LATENCY: Jika sudah ada data, langsung buka modal
    if (analysisResult && !isAnalyzing) {
      setShowModal(true);
      return;
    }

    if (!cvData || !userId) {
      alert("Please login and upload your CV first");
      return;
    }

    // 3. FALLBACK: Hanya fetch jika data belum ada (misal cache expired)
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
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Penentuan warna badge berdasarkan score
  const getScoreStyles = (score: number) => {
    if (score >= 75) return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (score >= 50) return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-red-50 text-red-600 border-red-100";
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
            <span className="px-3 py-1 bg-muted/10 text-muted text-[10px] font-bold rounded-full uppercase tracking-wider">
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
            <span className="text-border-custom">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {job.location}
            </span>
            <span className="text-border-custom">•</span>
            <span className="flex items-center gap-1 capitalize">
              <Briefcase className="h-3.5 w-3.5" /> {job.locationType}
            </span>
          </div>
        </div>

        {matchScore !== null && (
          <div className="mt-5 bg-muted/5 border border-border-custom rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black text-muted uppercase tracking-wider">
                Quick Match
              </p>
              <span
                className={`text-[10px] font-bold uppercase ${matchScore >= 75 ? "text-emerald-600" : "text-amber-600"}`}
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
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {/* Tampilkan skill yang cocok sebagai preview */}
                  {analysisResult.matched_skills?.length > 0
                    ? `Great match for ${analysisResult.matched_skills[0]}`
                    : "Matches your profile"}
                </p>
                {analysisResult.missing_skills?.length > 0 && (
                  <p className="text-xs text-muted">
                    Missing:{" "}
                    <span className="text-rose-600 font-medium">
                      {analysisResult.missing_skills.slice(0, 2).join(", ")}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted italic">
                Analyzing match details...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <LinkButton
          href={job.url}
          target="_blank"
          variant="primary"
          className="flex-1 rounded-xl py-2.5 text-sm font-bold"
        >
          View Details
        </LinkButton>
        <Button
          variant="outline"
          className="flex-1 rounded-xl py-2.5 text-sm font-bold"
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
        >
          {/* Text button jadi dinamis */}
          {analysisResult ? "Full Analysis" : "Analyze"}
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
