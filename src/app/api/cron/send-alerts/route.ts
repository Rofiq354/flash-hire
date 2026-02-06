// app/api/cron/send-alerts/route.ts

import { JobAlertEmail } from "@/app/(app)/emails/JobAlertEmail";
import { processSingleAlert } from "@/cron/processSingleAlert";
import prisma from "@/lib/prisma";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function shouldRun(alert: any) {
  if (!alert.last_sent_at) return true;
  const now = new Date();
  const last = new Date(alert.last_sent_at);
  const diffInMs = now.getTime() - last.getTime();
  const frequency = alert.frequency?.toLowerCase();

  if (frequency === "daily") return diffInMs >= 24 * 60 * 60 * 1000;
  if (frequency === "weekly") return diffInMs >= 7 * 24 * 60 * 60 * 1000;
  return false;
}
export async function POST(req: Request) {
  console.log("🟢 CRON JOB STARTED");

  // 1. Verifikasi Upstash Signature
  const signature = req.headers.get("upstash-signature");
  if (!signature) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 2. Ambil Alert Aktif
    const alerts = await prisma.job_alerts.findMany({
      where: { is_active: true },
    });

    for (const alert of alerts) {
      // 3. Cek apakah sudah waktunya dikirim?
      console.log(`Checking alert for: ${alert.email}`);
      if (!shouldRun(alert)) {
        console.log(`[SKIP] ${alert.email} belum waktunya dikirim.`);
        continue;
      }

      // 4. Proses Matching (Pakai logika AI yang kita buat tadi)
      // Modifikasi processSingleAlert agar me-return hasil match
      const matchedJobs = await processSingleAlert(alert);

      if (!matchedJobs || matchedJobs.length === 0) {
        console.log(
          `[SKIP] Tidak ada lowongan baru yang cocok untuk ${alert.email}`,
        );
        continue;
      }

      // 5. Kirim Email pakai React Email Template
      console.log(`🚀 Sending email to ${alert.email}...`);

      const formattedJobs = matchedJobs.map((job: any) => {
        let salaryString = "Competitive";
        if (job.salary && typeof job.salary === "object") {
          const min = job.salary.min?.toLocaleString();
          const max = job.salary.max?.toLocaleString();
          const currency = job.salary.currency || "$";
          salaryString =
            min && max ? `${currency}${min} - ${max}` : "Competitive";
        }

        return {
          title: job.title || "Untitled Position",
          company: job.company || "Unknown Company",
          location: job.location || "Remote / On-site",
          url: job.redirect_url || job.url || "#",
          salary: salaryString,
          matchScore: job.match?.score || 0,
        };
      });

      // from: "JobAlert <noreply@yourdomain.com>",
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: alert.email,
        subject: `New Job Opportunities for ${alert.job_title}`,
        react: React.createElement(JobAlertEmail, {
          jobs: formattedJobs,
          jobTitle: alert.job_title,
        }),
      });

      if (!error) {
        // 6. Update last_sent_at jika berhasil
        await prisma.job_alerts.update({
          where: { id: alert.id },
          data: { last_sent_at: new Date() },
        });
        console.log(`✅ Email sent to ${alert.email}`);
      } else {
        console.error("🔴 Resend Error:", error);
      }
    }

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("🔴 CRON ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
