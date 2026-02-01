"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardInitial } from "@/components/organisms/DashboardInitial";
import { ExtractionLoading } from "@/components/molecules/ExtractionLoading";
import { uploadAndAnalyzeCV } from "./action";

export default function UploadClient() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("cv", file);

      const result = await uploadAndAnalyzeCV(formData);

      if (result.success) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong during analysis.");
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
        <ExtractionLoading />
      </div>
    );
  }

  return <DashboardInitial onUpload={handleUpload} />;
}
