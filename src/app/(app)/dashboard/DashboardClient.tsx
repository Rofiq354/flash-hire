"use client";

import { useState, useMemo } from "react";
import { DashboardContent } from "@/components/organisms/dashboard/DashboardContent";

interface Props {
  initialUser: any;
  initialAlert: any;
  initialCv: any;
  fetchedJobs: any[];
}

export default function DashboardClient({
  initialUser,
  initialCv,
  initialAlert,
  fetchedJobs,
}: Props) {
  const [alertData, setAlertData] = useState(initialAlert);
  const [jobs, setJobs] = useState(fetchedJobs);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshJobs = async (newKeyword: string, newLocation: string) => {
    setIsSyncing(true);
    try {
      const res = await fetch(
        `/api/jobs/search?keyword=${newKeyword}&location=${newLocation}&userId=${initialUser?.id}`,
      );
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Judul Dashboard */}
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome back, {initialUser?.user_metadata.full_name || "User"}!
      </h1>
      <p className="text-sm text-slate-500">
        Here’s a quick overview of your CV analysis and top job matches.
      </p>

      {/* Dashboard Content */}
      <DashboardContent
        cvData={initialCv}
        userId={initialUser?.id}
        userEmail={initialUser?.email}
        jobs={jobs}
        alertData={alertData}
        setAlertData={setAlertData}
        onAlertChange={refreshJobs}
        isSyncing={isSyncing}
      />
    </div>
  );
}
