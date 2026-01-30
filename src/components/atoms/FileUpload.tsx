// src/components/atoms/FileUpload.tsx
import { useCallback } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export const FileUpload = ({
  onFileSelect,
  accept = ".pdf",
}: FileUploadProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="relative group border-2 border-dashed border-slate-200 rounded-3xl p-10 hover:border-primary transition-all bg-slate-50/50 text-center">
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="space-y-2">
        <div className="text-4xl">📄</div>
        <p className="text-sm font-semibold text-slate-700">
          Click or drag your CV here
        </p>
        <p className="text-xs text-slate-400">Support PDF only (Max 5MB)</p>
      </div>
    </div>
  );
};
