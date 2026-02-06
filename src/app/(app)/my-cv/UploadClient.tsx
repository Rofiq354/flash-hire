"use client";

import { useEffect, useState } from "react";
import { DashboardInitial } from "@/components/organisms/DashboardInitial";
import { ExtractionLoading } from "@/components/molecules/ExtractionLoading";
import { CvResultPreview } from "@/components/organisms/my-cv/CvResultPreview";
import { uploadAndAnalyzeCV } from "./action";
import { Button } from "@/components/atoms/Button";
import { Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function UploadClient({ initialCv }: { initialCv: any }) {
  const searchParams = useSearchParams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentCv, setCurrentCv] = useState(initialCv);

  useEffect(() => {
    if (searchParams.get("action") === "reupload") {
      setCurrentCv(null);
    }
  }, [searchParams]);

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("cv", file);
      const result = await uploadAndAnalyzeCV(formData);

      if (result.success) {
        setCurrentCv(result.data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ExtractionLoading />
      </div>
    );
  }

  if (currentCv) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Extracted Profile</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentCv(null)}
          >
            <Upload size={16} className="mr-2" /> Re-upload New CV
          </Button>
        </div>

        <CvResultPreview data={currentCv} />
      </div>
    );
  }

  return <DashboardInitial onUpload={handleUpload} />;
}
