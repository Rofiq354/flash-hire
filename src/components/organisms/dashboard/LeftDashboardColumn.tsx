// src/components/organisms/dashboard/LeftDashboardColumn.tsx
import { CVAnalysisCard } from "@/components/molecules/dashboard/CVAnalysisCard";
import { AITipCard } from "@/components/molecules/dashboard/AITipCard";

export const LeftDashboardColumn = ({ cvData }: { cvData: any }) => {
  const matchPower = cvData?.parsed_data?.match_power || 0;
  const lastUpdated = cvData?.updated_at
    ? new Date(cvData.updated_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })
    : "Recently";

  return (
    <div className="col-span-12 xl:col-span-4 lg:col-span-5 space-y-6">
      <CVAnalysisCard
        skills={cvData?.skills || []}
        matchPower={matchPower}
        lastUpdated={lastUpdated}
        uploadLink="/my-cv"
      />
      <AITipCard summary={cvData?.parsed_data?.summary} />
    </div>
  );
};
