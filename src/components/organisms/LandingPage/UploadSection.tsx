// src/components/organisms/UploadSection.tsx
import { Button } from "@/components/atoms/Button";

export const UploadSection = () => {
  return (
    <section className="px-6 py-20 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="relative group p-12 border-2 border-dashed border-primary/30 rounded-[40px] bg-white shadow-sm hover:border-primary/50 transition-all text-center space-y-6">
          {/* Icon Upload */}
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Upload Your CV (PDF)
            </h2>
            <p className="text-muted max-w-md mx-auto">
              Drag and drop your resume here to instantly extract your
              professional profile and see matching job alerts.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <Button
              variant="primary"
              className="px-12 py-4 rounded-2xl shadow-xl shadow-primary/20"
            >
              Select PDF File
            </Button>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
              Max File Size 10MB
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
