// app/api/job-alerts/route.ts

import { getUserActiveJobAlerts } from "@/lib/jobs/job-storage-adapted.service";
import { prisma } from "@/lib/prisma"; // Pastikan path prisma benar
import { NextRequest, NextResponse } from "next/server";

// --- FUNGSI GET (Untuk Mendapatkan Alert) ---
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
      data: { alerts, count: alerts.length },
    });
  } catch (error) {
    console.error("Error getting job alerts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get job alerts" },
      { status: 500 },
    );
  }
}

// --- TAMBAHKAN FUNGSI POST (Untuk Simpan Alert Baru) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const alert = await prisma.job_alerts.upsert({
      where: {
        user_id: body.userId,
      },
      update: {
        job_title: body.job_title,
        location: body.location,
        frequency: body.frequency,
        email: body.email,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        user_id: body.userId,
        job_title: body.job_title,
        location: body.location,
        frequency: body.frequency,
        email: body.email,
        is_active: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: alert,
    });
  } catch (error: any) {
    console.error("Error creating job alert:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create alert" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 },
      );
    }

    await prisma.job_alerts.delete({
      where: { user_id: userId },
    });

    return NextResponse.json({ success: true, message: "Alert deleted" });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
