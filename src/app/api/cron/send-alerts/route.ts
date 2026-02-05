// app/api/cron/send-alerts/route.ts

import { JobAlertEmail } from "@/app/(app)/emails/JobAlertEmail";
import { fetchAdzunaJobs } from "@/lib/adzuna";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req: Request) {
  console.log("🟢 REQUEST MASUK DARI UPSTASH");
  
  const signature = req.headers.get("upstash-signature");
  if (!signature) {
    console.log("🔴 ERROR: Signature tidak ditemukan di header");
    return new Response("No signature", { status: 401 });
  }

  // SEMENTARA: Komen bagian verifikasi ini jika kamu ingin ngetes lewat Postman/langsung
  // const isValid = await receiver.verify({ signature, body: await req.text() });
  // if (!isValid) return new Response("Invalid signature", { status: 401 });

  try {
    const alerts = await prisma.job_alerts.findMany({ where: { is_active: true } });
    console.log(`🔍 Alert Aktif: ${alerts.length} data`);

    if (alerts.length === 0) {
      console.log("⚠️ Berhenti: Tidak ada user yang mengaktifkan alert.");
      return Response.json({ message: "No active alerts" });
    }

    for (const alert of alerts) {
      console.log(`📡 Mencari di Adzuna untuk: ${alert.job_title}...`);
      const matchedJobs = await fetchAdzunaJobs(alert);
      
      console.log(`📊 Hasil Adzuna: ${matchedJobs.length} lowongan ditemukan`);

      if (matchedJobs.length === 0) {
        console.log("⚠️ Berhenti: Adzuna tidak punya lowongan untuk kriteria ini.");
        continue; 
      }

      console.log("🚀 Mencoba panggil API Resend...");
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: alert.email,
        subject: 'Tes Tanpa React Template',
        html: `<p>Ditemukan ${matchedJobs.length} lowongan untuk ${alert.job_title}</p>`
      });

      if (error) {
        console.log("🔴 RESEND ERROR:", error);
      } else {
        console.log("✅ RESEND BERHASIL: Email ID", data?.id);
      }
    }

    return Response.json({ success: true });
  } catch (err: any) {
    console.log("🔴 CRASH ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}