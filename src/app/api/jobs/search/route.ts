// ============================================================================
// app/api/jobs/search/route.ts - Search with Auto-Caching
// ============================================================================

import { fetchAdzunaJobs } from "@/services/jobs/adzuna.service";
import { cacheJobsBatch } from "@/lib/jobs/job-storage-adapted.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      keyword,
      location,
      countryCode = "sg",
      page = 1,
      resultsPerPage = 10,
      maxDays = 14,
      isRemote,
      salaryMin,
      salaryMax,
    } = body;

    // Fetch from Adzuna
    const result = await fetchAdzunaJobs({
      keyword,
      location,
      countryCode,
      page,
      resultsPerPage,
      maxDays,
      isRemote,
      salaryMin,
      salaryMax,
    });

    // Cache all jobs in background (don't await)
    if (result.jobs && result.jobs.length > 0) {
      cacheJobsBatch(result.jobs).catch((err) =>
        console.error("Cache failed:", err),
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Job search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search jobs",
      },
      { status: 500 },
    );
  }
}
