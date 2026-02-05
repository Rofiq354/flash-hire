"use client";

import { useState, useMemo } from "react";
import { DashboardContent } from "@/components/organisms/dashboard/DashboardContent";
import JobAlertModal from "@/components/organisms/JobAlertModal";
import { calculateMatchScore } from "@/lib/jobs/matchScore";

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
  const [showModal, setShowModal] = useState(false);

  const jobs = fetchedJobs;

  // Contoh: hitung matchScore untuk semua job, cuma dihitung saat cv.skills atau fetchedJobs berubah
  // const jobsWithScore = useMemo(() => {
  //   if (!initialCv?.skills) return fetchedJobs;

  //   return fetchedJobs.map((job) => ({
  //     ...job,
  //     matchScore: calculateMatchScore(
  //       initialCv.skills,
  //       `${job.title} ${job.description}`,
  //     ),
  //   }));
  // }, [initialCv?.skills, fetchedJobs]);

  // console.log(initialCv);

  return (
    <div className="space-y-8">
      {/* Judul Dashboard */}
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome back, {initialUser?.user_metadata.full_name || "User"}!
      </h1>
      <p className="text-sm text-slate-500">
        Here’s a quick overview of your CV analysis and top job matches.
      </p>

      {/* Modal Job Alert */}
      {showModal && (
        <JobAlertModal
          onSuccess={(data) => {
            setAlertData(data);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Dashboard Content */}
      <DashboardContent
        user={initialUser}
        cvData={initialCv}
        userId={initialUser?.id}
        jobs={jobs} // pakai matchScore
        alertData={alertData}
      />
    </div>
  );
}
