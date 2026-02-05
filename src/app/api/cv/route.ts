// ============================================================================
// app/api/cv/route.ts - CV Management
// ============================================================================

import {
  getUserCV,
  updateCVParsedData,
} from "@/lib/jobs/job-storage-adapted.service";
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

    const cv = await getUserCV(userId);

    if (!cv) {
      return NextResponse.json(
        { success: false, error: "CV not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: cv,
    });
  } catch (error) {
    console.error("Error getting CV:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get CV" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, parsedData } = await req.json();

    if (!userId || !parsedData) {
      return NextResponse.json(
        { success: false, error: "userId and parsedData are required" },
        { status: 400 },
      );
    }

    const success = await updateCVParsedData(userId, parsedData);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to update CV" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "CV updated successfully",
    });
  } catch (error) {
    console.error("Error updating CV:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update CV" },
      { status: 500 },
    );
  }
}
