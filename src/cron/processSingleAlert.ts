// src/cron/processSingleAlert.ts
import { prisma } from "@/lib/prisma";
import { fetchAdzunaJobs } from "@/services/jobs/adzuna.service";
import {
  normalizeAdzunaJob,
  NormalizedJob,
} from "@/lib/jobs/normalizeAzunaJob";
import { evaluateJobMatch } from "@/services/jobMatch.service";

function isValidJob(job: any) {
  if (!job.createdAt) return true;
  const created = new Date(job.createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 14; // Lowongan maksimal 14 hari
}

export async function processSingleAlert(alert: any) {
  // 1. Ambil CV user (pastikan relasi tabel benar)
  const cv = await prisma.cvs.findUnique({
    where: { user_id: alert.user_id },
  });

  if (!cv || !cv.parsed_data) {
    console.warn("[CRON] CV not found or not parsed, skip:", alert.user_id);
    return;
  }

  // 2. Fetch jobs dari Adzuna
  const rawJobs = await fetchAdzunaJobs(
    {
      keyword: alert.job_title,
      location: alert.location,
      // Buka filter remote-nya
      isRemote: alert.is_remote,
      resultsPerPage: 15, // Ambil sedikit lebih banyak karena akan difilter
    },
    alert.user_id,
  );

  if (rawJobs.error || !rawJobs.jobs || rawJobs.jobs.length === 0) {
    console.log(`[ALERT ${alert.id}] No jobs found or error occurred`);
    return;
  }

  // 3. Normalize + filter masa aktif
  const jobs: NormalizedJob[] = rawJobs.jobs.filter(isValidJob);

  if (!jobs.length) return;

  // 4. AI Match (Limit 5-10 untuk efisiensi token AI)
  const results = [];

  for (const job of jobs.slice(0, 3)) {
    try {
      const match = await evaluateJobMatch({
        jobDescription: job.description,
        cvData: cv.parsed_data,
      });

      // GUNAKAN min_match_score dari database
      if (match.score >= (alert.min_match_score || 70)) {
        results.push({
          ...job,
          match,
        });
      }
    } catch (err) {
      console.error(`[AI_ERROR] Failed evaluating job ${job.id}:`, err);
      continue;
    }
  }

  // 5. Sort by score tertinggi
  results.sort((a, b) => b.match.score - a.match.score);

  // 6. Final Action
  if (results.length > 0) {
    console.log(
      `[ALERT ${alert.id}] Found ${results.length} matches above ${alert.min_match_score}%`,
    );

    // TODO:
    // await sendEmailAlert(alert.email, results);
    // await saveAlertResultsToDb(alert.id, results);
  } else {
    console.log(`[ALERT ${alert.id}] No jobs matched the criteria.`);
  }

  return results;
}
