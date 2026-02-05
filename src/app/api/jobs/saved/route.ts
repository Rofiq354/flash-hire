// ============================================================================
// app/api/jobs/saved/route.ts - Save/Get Saved Jobs
// ============================================================================

import {
  saveJobForUser,
  getUserSavedJobs,
  removeSavedJob,
} from "@/lib/jobs/job-storage-adapted.service";
import { NextRequest, NextResponse } from "next/server";

// Save a job
export async function POST(req: NextRequest) {
  try {
    const { userId, job, matchScore } = await req.json();

    if (!userId || !job) {
      return NextResponse.json(
        { success: false, error: "userId and job data are required" },
        { status: 400 },
      );
    }

    const saved = await saveJobForUser(userId, job, matchScore);

    return NextResponse.json({
      success: true,
      data: saved,
      message: "Job saved successfully",
    });
  } catch (error: any) {
    // Handle unique constraint error
    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Job already saved" },
        { status: 400 },
      );
    }

    console.error("Error saving job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save job" },
      { status: 500 },
    );
  }
}

// Get user's saved jobs
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 },
      );
    }

    const jobs = await getUserSavedJobs(userId);

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        count: jobs.length,
      },
    });
  } catch (error) {
    console.error("Error getting saved jobs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get saved jobs" },
      { status: 500 },
    );
  }
}

// Delete a saved job
export async function DELETE(req: NextRequest) {
  try {
    const { userId, jobId } = await req.json();

    if (!userId || !jobId) {
      return NextResponse.json(
        { success: false, error: "userId and jobId are required" },
        { status: 400 },
      );
    }

    const success = await removeSavedJob(userId, jobId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to remove saved job" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Job removed from saved list",
    });
  } catch (error) {
    console.error("Error removing saved job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove saved job" },
      { status: 500 },
    );
  }
}
