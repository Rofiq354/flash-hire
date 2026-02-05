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
      cacheJobsBatch(result.jobs as []).catch((err) =>
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "Software Engineer";
    const location = searchParams.get("location") || "";
    const userId = searchParams.get("userId");

    const jobsData = await fetchAdzunaJobs(
      {
        keyword,
        location,
        page: 1,
        resultsPerPage: 2,
        maxDays: 14,
      },
      userId || undefined,
    );

    return NextResponse.json({
      success: true,
      jobs: jobsData?.jobs || [],
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ success: false, jobs: [] }, { status: 500 });
  }
}
