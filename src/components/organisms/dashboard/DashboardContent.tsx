// src/components/organisms/DashboardContent.tsx
import { LeftDashboardColumn } from "./LeftDashboardColumn";
import { MiddleDashboardColumn } from "./MiddleDashboardColumn";
import { RightDashboardColumn } from "./RightDashboardColumn";

export const DashboardContent = ({
  alertData,
  setAlertData,
  onAlertChange,
  isSyncing,
  ...props
}: any) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <LeftDashboardColumn cvData={props.cvData} />
      <MiddleDashboardColumn
        jobs={props.jobs}
        cvData={props.cvData}
        userId={props.userId}
        isSyncing={isSyncing}
      />
      <RightDashboardColumn
        alertData={alertData}
        setAlertData={setAlertData}
        onAlertChange={onAlertChange}
        userId={props.userId}
        userEmail={props.userEmail}
      />
    </div>
  );
};
