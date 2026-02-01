// src/app/(app)/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { fetchAdzunaJobs } from "@/services/jobs/adzuna.service";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/user.service";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Cari CV user
  const userCv = await prisma.cvs.findUnique({
    where: { user_id: user?.id },
  });

  // console.log("userCv", userCv);

  // Kalau belum ada CV, redirect ke upload page
  if (!userCv) {
    redirect("/my-cv");
  }

  // Ambil data job alert
  const alertData = await prisma.job_alerts.findFirst({
    where: { user_id: user?.id },
  });

  // Ambil jobs dari Adzuna, map alertData ke parameter
  const jobs = await fetchAdzunaJobs({
    keyword: alertData?.job_title || "Developer",
    location: (alertData?.location as string) || "",
    page: 1,
    resultsPerPage: 2,
    maxDays: 14,
  });

  // console.log(jobs)

  return (
    <DashboardClient
      initialUser={user}
      initialCv={userCv}
      initialAlert={alertData}
      fetchedJobs={jobs.jobs}
    />
  );
}
