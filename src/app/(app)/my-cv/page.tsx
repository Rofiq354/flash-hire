// src/app/dashboard/upload/page.tsx
import UploadClient from "./UploadClient";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Boost Your Career with AI
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Upload your resume and let our AI match you with the most relevant
            job opportunities in seconds.
          </p>
        </header>

        <UploadClient />
      </div>
    </div>
  );
}
