"use client";

// src/components/molecules/AnalysisModal.tsx

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data: {
    score: number;
    match_reasons: string[];
    missing_skills: string[];
    advice: string;
  } | null;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header (fixed) */}
        <div className="flex justify-between items-start p-8 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 pr-4">
            AI Analysis: <span className="text-indigo-600">{jobTitle}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full shrink-0"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">
                Gemini is comparing your CV...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score */}
              <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-2xl">
                <div className="text-3xl font-black text-indigo-600">
                  {data?.score ?? 0}%
                </div>
                <div className="text-sm text-indigo-700 font-medium">
                  Match Score based on your current profile
                </div>
              </div>

              {/* Reasons */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Why it matches
                </p>
                <div className="space-y-2">
                  {data?.match_reasons?.map((reason: string, i: number) => (
                    <div key={i} className="flex gap-2 text-sm text-slate-600">
                      <span className="text-green-500">✓</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {data?.missing_skills?.length ? (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Gap identified
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.missing_skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold italic"
                      >
                        ? {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer (fixed) */}
        {!isLoading && data?.advice && (
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 rounded-b-4xl">
            <p className="text-xs text-slate-500 italic text-center">
              “{data.advice}”
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
