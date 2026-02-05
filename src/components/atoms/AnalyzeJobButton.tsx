// components/atoms/AnalyzeJobButton.tsx
"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Target } from "lucide-react";
import { AnalysisModal } from "../molecules/AnalysisModal";

interface AnalyzeJobButtonProps {
  job: any;
  cvData?: any;
  className?: string;
}

export function AnalyzeJobButton({
  job,
  cvData,
  className,
}: AnalyzeJobButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAnalyze = async () => {
    if (!cvData) {
      alert("Please upload your CV first");
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
          userCV: cvData,
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
      alert("Failed to analyze job match");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleAnalyze}
        isLoading={isAnalyzing}
        className={className}
      >
        <Target className="h-4 w-4 mr-2" />
        {analysisResult ? "Re-analyze Match" : "🎯 Analyze Match"}
      </Button>

      {showModal && (
        <AnalysisModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isLoading={isAnalyzing}
          data={analysisResult}
          jobTitle={job.title}
        />
      )}
    </>
  );
}
