// src/cron/processJobAlerts.ts
import { prisma } from "@/lib/prisma";
import { processSingleAlert } from "./processSingleAlert";

function shouldRun(alert: any) {
  if (!alert.last_sent_at) return true;

  const now = new Date();
  const last = new Date(alert.last_sent_at);

  if (alert.frequency === "Daily") {
    return now.getTime() - last.getTime() >= 24 * 60 * 60 * 1000;
  }

  if (alert.frequency === "Weekly") {
    return now.getTime() - last.getTime() >= 7 * 24 * 60 * 60 * 1000;
  }

  return false;
}

export async function processJobAlerts() {
  console.log("[CRON] Job Alert started");

  const alerts = await prisma.job_alerts.findMany({
    where: {
      is_active: true,
    },
  });

  for (const alert of alerts) {
    try {
      if (!shouldRun(alert)) continue;

      await processSingleAlert(alert);

      await prisma.job_alerts.update({
        where: { id: alert.id },
        data: { last_sent_at: new Date() },
      });
    } catch (err) {
      console.error(`[ALERT_FAILED] ${alert.id}`, err);
      // lanjut ke alert berikutnya
    }
  }

  console.log("[CRON] Job Alert finished");
}
