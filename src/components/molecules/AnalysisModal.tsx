// components/molecules/AnalysisModal.tsx
"use client";

import { X } from "lucide-react";
import { Button } from "../atoms/Button";
import SkillGapDashboard from "../organisms/dashboard/SkillGapDashboard";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data: any | null;
  jobTitle: string;
}

export const AnalysisModal = ({
  isOpen,
  onClose,
  isLoading,
  data,
  jobTitle,
}: AnalysisModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between z-55 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Job Match Analysis
            </h2>
            <p className="text-sm text-gray-600 mt-1">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 z-51">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4" />
              <p className="text-gray-600 font-medium">
                Analyzing your match with this job...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This may take a few seconds
              </p>
            </div>
          ) : data ? (
            <SkillGapDashboard analysis={data} />
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>No analysis data available</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto px-8"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
