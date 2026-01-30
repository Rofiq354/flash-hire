// src/components/molecules/UploadCard.tsx
"use client";

import { useState } from "react";
import { FileUpload } from "@/components/atoms/FileUpload";
import { Button } from "@/components/atoms/Button";

export const UploadCard = ({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="bg-white border border-slate-100 p-8 rounded-4xl shadow-sm">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            Upload your Resume
          </h3>
          <p className="text-sm text-slate-500">
            Our AI will extract your skills and experiences automatically.
          </p>
        </div>

        <FileUpload onFileSelect={(f) => setFile(f)} />

        {file && (
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700 truncate max-w-37.5">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              onClick={() => onUpload(file)}
              className="py-2 px-6 text-sm"
            >
              Analyze CV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
