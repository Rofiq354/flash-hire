// ============================================================================
// app/api/job-alerts/route.ts - Job Alerts Management
// ============================================================================

import { getUserActiveJobAlerts } from "@/lib/jobs/job-storage-adapted.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 },
      );
    }

    const alerts = await getUserActiveJobAlerts(userId);

    return NextResponse.json({
      success: true,
      data: {
        alerts,
        count: alerts.length,
      },
    });
  } catch (error) {
    console.error("Error getting job alerts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get job alerts" },
      { status: 500 },
    );
  }
}
