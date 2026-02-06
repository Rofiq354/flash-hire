// app/api/jobs/[id]/route.ts

import {
  cacheJob,
  getCachedJob,
  getSavedJobById,
} from "@/lib/jobs/job-storage-adapted.service";
import { NormalizedJob } from "@/lib/jobs/normalizeAzunaJob";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;
    const jobId = params.id;

    // 1. Try cache
    let job = await getCachedJob(jobId);

    if (!job && userId) {
      // 2. Try saved_jobs
      job = await getSavedJobById(userId, jobId);

      if (job) {
        // Cache it for next time
        await cacheJob(jobId, job);
      }
    }

    // 🔥 3. NEW: If still not found, try to fetch from recent search results
    if (!job) {
      // This is a fallback - check if job was recently fetched
      // You could store a reference in Redis or check saved_jobs table
      // for ANY user who saved this job
      const anyUserSaved = await getJobFromAnySavedJobs(jobId);

      if (anyUserSaved) {
        job = anyUserSaved;
        await cacheJob(jobId, job as NormalizedJob);
      }
    }

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: "Job not found",
          message: "This job is no longer available or has expired",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error getting job details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get job details" },
      { status: 500 },
    );
  }
}

// Helper function: Get job from ANY user's saved_jobs
async function getJobFromAnySavedJobs(jobId: string) {
  const { data } = await createClient()
    .from("saved_jobs")
    .select("job_data")
    .eq("job_id", jobId)
    .limit(1)
    .single();

  return data?.job_data || null;
}
