// src/components/molecules/ProfileCompletion.tsx
import { Button } from "@/components/atoms/Button";

interface ProfileCompletionProps {
  name: string;
  data: any;
  onReset: () => void;
}

export const ProfileCompletion = ({
  name,
  data,
  onReset,
}: ProfileCompletionProps) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="p-10 bg-white rounded-[40px] text-center border shadow-sm">
      <div className="text-5xl mb-4">✨</div>
      <h2 className="text-2xl font-bold">Analysis Complete, {name}!</h2>

      {/* Tampilkan statistik sederhana hasil Gemini */}
      <div className="flex justify-center gap-4 mt-6">
        <div className="bg-slate-50 px-4 py-2 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            Skills
          </p>
          <p className="text-xl font-bold text-primary">
            {data?.skills?.length || 0}
          </p>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            Exp
          </p>
          <p className="text-xl font-bold text-primary">
            {data?.experience?.length || 0}
          </p>
        </div>
      </div>

      <p className="text-slate-500 mt-6 max-w-sm mx-auto">
        We've successfully extracted your profile. You can now use this to
        auto-match with jobs.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <button className="bg-primary text-white font-bold py-3 px-8 rounded-2xl hover:bg-primary-hover transition">
          View My AI Profile
        </button>
        <button
          onClick={onReset}
          className="text-sm text-slate-400 font-semibold hover:underline"
        >
          Upload another CV
        </button>
      </div>
    </div>
  </div>
);
