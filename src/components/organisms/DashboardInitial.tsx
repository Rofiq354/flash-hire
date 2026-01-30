// src/components/organisms/DashboardInitial.tsx
import { UploadCard } from "@/components/molecules/UploadCard";

interface DashboardInitialProps {
  onUpload: (file: File) => void;
}

export const DashboardInitial = ({ onUpload }: DashboardInitialProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
    <div className="lg:col-span-2">
      <UploadCard onUpload={onUpload} />
    </div>

    <div className="space-y-6">
      <div className="bg-primary p-8 rounded-4xl text-white shadow-xl shadow-primary/20">
        <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4">
          💡
        </div>
        <h4 className="font-bold text-lg mb-2">Pro Tip:</h4>
        <p className="text-sm text-white/80 leading-relaxed">
          Make sure your CV is in English for better AI extraction accuracy.
          Gemini works best with structured PDF text.
        </p>
      </div>
    </div>
  </div>
);
