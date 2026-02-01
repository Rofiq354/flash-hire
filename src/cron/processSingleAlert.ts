// src/cron/processSingleAlert.ts
import { prisma } from "@/lib/prisma";
import { fetchAdzunaJobs } from "@/services/adzuna.service";
import { normalizeAdzunaJob } from "@/lib/jobs/normalizeAzunaJob";
import { evaluateJobMatch } from "@/services/jobMatch.service";

function isValidJob(job: any) {
  if (!job.createdAt) return true;

  const created = new Date(job.createdAt);
  const now = new Date();

  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

  // Anggap > 14 hari = closing soon
  return diffDays <= 14;
}

export async function processSingleAlert(alert: any) {
  // 1. Ambil CV user
  const cv = await prisma.cvs.findUnique({
    where: { user_id: alert.user_id },
  });

  if (!cv || !cv.parsed_data) {
    console.warn("[CRON] CV not found, skip:", alert.user_id);
    return;
  }

  // 2. Fetch jobs dari Adzuna
  const rawJobs = await fetchAdzunaJobs({
    keyword: alert.job_title,
    location: alert.location,
    // remote: alert.is_remote,
    resultsPerPage: 10,
  });

  if (!rawJobs.length) return;

  // 3. Normalize + filter
  const jobs = rawJobs.map(normalizeAdzunaJob).filter(isValidJob);

  if (!jobs.length) return;

  // 4. AI Match (limit!)
  const results = [];

  for (const job of jobs.slice(0, 10)) {
    const match = await evaluateJobMatch({
      jobDescription: job.description,
      cvData: cv.parsed_data,
    });

    if (match.score >= alert.min_match_score) {
      results.push({
        ...job,
        match,
      });
    }
  }

  // 5. Sort by score
  results.sort((a, b) => b.match.score - a.match.score);

  // 6. Simpan / kirim (sementara log dulu)
  console.log(`[ALERT ${alert.id}] ${results.length} matched jobs`);

  // TODO:
  // - save to db
  // - send email
}
