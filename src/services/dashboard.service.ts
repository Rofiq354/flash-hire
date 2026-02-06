// src/services/dashboard.service.ts
import { prisma } from "@/lib/prisma";
import { fetchAdzunaJobs } from "./jobs/adzuna.service";
import { calculateMatchScore } from "@/lib/jobs/matchScore";
import { NormalizedJob } from "@/lib/jobs/normalizeAzunaJob";

interface DashboardData {
  cv: any;
  alert: any;
  jobs: any[];
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  // 1. Ambil CV user
  const cv = await prisma.cvs.findUnique({
    where: { user_id: userId },
  });

  // 2. Ambil Job Alert user
  const alert = await prisma.job_alerts.findUnique({
    where: { user_id: userId },
  });

  // 3. Fetch Jobs dari Adzuna pakai alert data
  let jobs: NormalizedJob[] = [];
  if (alert) {
    jobs = await fetchAdzunaJobs({
      keyword: alert.job_title,
      location: alert.location || undefined,
      isRemote: alert.is_remote || false,
      resultsPerPage: 5,
    });
  }

  // 4. Tambahkan matchScore per job
  const jobsWithScore = jobs.map((job) => ({
    ...job,
    matchScore: calculateMatchScore(
      cv?.skills || [],
      `${job.title} ${job.description}`,
    ),
  }));

  return {
    cv,
    alert,
    jobs: jobsWithScore,
  };
}
