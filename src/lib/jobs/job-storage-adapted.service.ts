// src/lib/jobs/job-storage-adapted.service.ts
// ============================================================================
// ADAPTED VERSION - Using Your Existing Schema
// ============================================================================

import { getAdzunaJobById } from "@/services/jobs/adzuna.service";
import { PrismaClient } from "@prisma/client";
import { NormalizedJob } from "./normalizeAzunaJob";

const prisma = new PrismaClient();

// ============================================================================
// OPTION 1: Use saved_jobs.job_data as Cache
// ============================================================================

/**
 * Save job to saved_jobs table for a specific user
 * The job_data field (Json) will store the full normalized job data
 */
export async function saveJobForUser(
  userId: string,
  job: any, // normalized job from Adzuna
  matchScore?: number,
) {
  try {
    const saved = await prisma.saved_jobs.create({
      data: {
        user_id: userId,
        job_id: job.id,
        job_title: job.title,
        company: job.company,
        location: job.location,
        match_score: matchScore || null,
        job_url: job.url,
        job_data: job, // Store complete job data here!
      },
    });

    return saved;
  } catch (error) {
    console.error("Error saving job for user:", error);
    throw error;
  }
}

/**
 * Get job details from saved_jobs (if user has saved it)
 */
export async function getSavedJobById(userId: string, jobId: string) {
  try {
    const saved = await prisma.saved_jobs.findUnique({
      where: {
        user_id_job_id: {
          user_id: userId,
          job_id: jobId,
        },
      },
    });

    return saved ? saved.job_data : null;
  } catch (error) {
    console.error("Error getting saved job:", error);
    return null;
  }
}

/**
 * Get all saved jobs for a user
 */
export async function getUserSavedJobs(userId: string) {
  const savedJobs = await prisma.saved_jobs.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });

  return savedJobs;
}

/**
 * Check if user has saved this job
 */
export async function isJobSavedByUser(userId: string, jobId: string) {
  const saved = await prisma.saved_jobs.findUnique({
    where: {
      user_id_job_id: {
        user_id: userId,
        job_id: jobId,
      },
    },
  });

  return !!saved;
}

/**
 * Remove saved job
 */
export async function removeSavedJob(userId: string, jobId: string) {
  try {
    await prisma.saved_jobs.delete({
      where: {
        user_id_job_id: {
          user_id: userId,
          job_id: jobId,
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Error removing saved job:", error);
    return false;
  }
}

// ============================================================================
// OPTION 2: Simple In-Memory Cache (for non-saved jobs)
// ============================================================================

/**
 * Simple in-memory cache for recently fetched jobs
 * This will be lost when server restarts, but that's okay
 */
class JobCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private TTL = 1000 * 60 * 60 * 24; // 24 hours

  set(jobId: string, jobData: any) {
    this.cache.set(jobId, {
      data: jobData,
      timestamp: Date.now(),
    });
  }

  get(jobId: string) {
    const cached = this.cache.get(jobId);

    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(jobId);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

export const jobCache = new JobCache();

// Run cleanup every hour
setInterval(() => jobCache.cleanup(), 1000 * 60 * 60);

// ============================================================================
// OPTION 3: Use Redis/Upstash for Better Caching
// ============================================================================

let redis: any = null;

try {
  const { Redis } = require("@upstash/redis");
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  console.log("✅ Redis cache enabled");
} catch (error) {
  console.log("ℹ️ Redis not configured, using in-memory cache");
}

export async function cacheJob(jobId: string, job: NormalizedJob) {
  if (!redis) return;

  try {
    await redis.setex(`job:${jobId}`, 60 * 60, JSON.stringify(job));
  } catch (error) {
    console.error("❌ Redis cache job failed:", error);
  }
}

export async function getCachedJob(jobId: string) {
  if (!redis) return null;

  try {
    const raw = await redis.get(`job:${jobId}`);
    if (!raw) return null;

    // Cek apakah raw adalah string yang valid
    if (typeof raw !== "string") {
      console.error(`Invalid data type in Redis for job ${jobId}:`, typeof raw);
      await redis.del(`job:${jobId}`);
      return null;
    }

    return JSON.parse(raw) as NormalizedJob;
  } catch (e) {
    console.error("Redis getCachedJob failed:", e);
    // Hapus data yang corrupt
    await redis.del(`job:${jobId}`).catch(() => {});
    return null;
  }
}

export async function getCachedScore(
  userId: string,
  jobId: string,
): Promise<number | null> {
  if (!redis) return null;

  const key = `match_score:${userId}:${jobId}`;

  try {
    const value = await redis.get(key);
    if (!value) return null;

    const score = Number(value);

    if (!Number.isInteger(score)) {
      await redis.del(key);
      return null;
    }

    return score;
  } catch (error) {
    console.error("❌ Redis get score failed:", error);
    return null;
  }
}

// Fungsi untuk simpan banyak score sekaligus (Batch)

export async function cacheScoresBatch(
  userId: string,
  scores: { id: string; score: number }[],
) {
  if (!redis || scores.length === 0) return;

  const pipeline = redis.pipeline();

  for (const { id, score } of scores) {
    if (!Number.isInteger(score)) continue;

    pipeline.setex(
      `match_score:${userId}:${id}`,
      60 * 60 * 24 * 7,
      String(score),
    );
  }

  await pipeline.exec();
}

type CachedJob = {
  id: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
};

const JOB_TTL = 60 * 60 * 24 * 7;

export async function cacheJobsBatch(jobs: CachedJob[]) {
  if (!redis || jobs.length === 0) return;

  try {
    const pipeline = redis.pipeline();

    for (const job of jobs) {
      if (!job.id) continue;

      pipeline.setex(`job:${job.id}`, JOB_TTL, JSON.stringify(job));
    }

    await pipeline.exec();
  } catch (error) {
    console.error("❌ Redis batch job cache failed:", error);
  }
}

// ============================================================================
// COMBINED: Get Job Details (Cache + Saved Jobs)
// ============================================================================

export async function getJobDetails(jobId: string, userId?: string) {
  let job = await getCachedJob(jobId);

  if (!job) {
    console.warn(`Job ${jobId} expired from cache`);
    return null;
  }

  // optional: inject latest score if user login
  if (userId) {
    const score = await getCachedScore(userId, jobId);
    if (score !== null) {
      job.matchScore = score;
    }
  }

  return job;
}

// ============================================================================
// Update Job Alert Last Sent
// ============================================================================

export async function updateJobAlertLastSent(alertId: string) {
  try {
    await prisma.job_alerts.update({
      where: { id: alertId },
      data: { last_sent_at: new Date() },
    });
  } catch (error) {
    console.error("Error updating job alert:", error);
  }
}

// ============================================================================
// Get Active Job Alerts for User
// ============================================================================

export async function getUserActiveJobAlerts(userId: string) {
  const alerts = await prisma.job_alerts.findMany({
    where: {
      user_id: userId,
      is_active: true,
    },
  });

  return alerts;
}

// ============================================================================
// Update CV Parsed Data
// ============================================================================

export async function updateCVParsedData(userId: string, parsedData: any) {
  try {
    await prisma.cvs.update({
      where: { user_id: userId },
      data: {
        parsed_data: parsedData,
        updated_at: new Date(),
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating CV:", error);
    return false;
  }
}

// ============================================================================
// Get User CV
// ============================================================================

export async function getUserCV(userId: string) {
  try {
    const cv = await prisma.cvs.findUnique({
      where: { user_id: userId },
    });
    return cv;
  } catch (error) {
    console.error("Error getting CV:", error);
    return null;
  }
}

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

export const jobStorage = {
  // Job operations
  saveJobForUser,
  getSavedJobById,
  getUserSavedJobs,
  isJobSavedByUser,
  removeSavedJob,
  getJobDetails,

  // Cache operations
  cacheJob,
  getCachedJob,
  cacheJobsBatch,

  // Job alert operations
  getUserActiveJobAlerts,
  updateJobAlertLastSent,

  // CV operations
  getUserCV,
  updateCVParsedData,
};
