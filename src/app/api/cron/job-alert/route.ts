// app/api/cron/job-alert/route.ts
import { NextResponse } from "next/server";
import { processJobAlerts } from "@/cron/processJobAlerts";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await processJobAlerts();

    return NextResponse.json({
      success: true,
      message: "Job alerts processed",
    });
  } catch (error) {
    console.error("[CRON_JOB_ALERT_ERROR]", error);

    return NextResponse.json(
      { success: false, error: "Cron failed" },
      { status: 500 },
    );
  }
}
