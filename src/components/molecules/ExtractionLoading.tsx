// src/components/molecules/ExtractionLoading.tsx
export const ExtractionLoading = () => (
  <div className="flex flex-col items-center justify-center p-20 space-y-4">
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-primary text-xs">
        AI
      </div>
    </div>
    <div className="text-center">
      <h3 className="font-bold text-slate-900 text-lg">
        Analyzing your profile...
      </h3>
      <p className="text-slate-500 text-sm animate-pulse">
        Gemini is extracting skills & experience
      </p>
    </div>
  </div>
);
