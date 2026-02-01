// src/components/organisms/DashboardContent.tsx
import { LeftDashboardColumn } from "./LeftDashboardColumn";
import { MiddleDashboardColumn } from "./MiddleDashboardColumn";
import { RightDashboardColumn } from "./RightDashboardColumn";

export const DashboardContent = ({ cvData, jobs, alertData }: any) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <LeftDashboardColumn cvData={cvData} />
      <MiddleDashboardColumn jobs={jobs} cvData={cvData} />
      <RightDashboardColumn alertData={alertData} />
    </div>
  );
};
