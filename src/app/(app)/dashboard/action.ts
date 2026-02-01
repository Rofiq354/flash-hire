"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma"; // Pakai prisma biar sinkron
import { revalidatePath } from "next/cache";

export async function createJobAlert(formData: {
  jobTitle: string;
  location: string;
  frequency: string;
  minScore: number;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  try {
    // Kita pakai Prisma Upsert:
    // Kalau sudah ada alert untuk user_id ini, kita update. Kalau belum, kita create.
    const alert = await prisma.job_alerts.upsert({
      where: {
        user_id: user.id,
      },
      update: {
        job_title: formData.jobTitle, // Sesuai nama kolom di DB kamu
        location: formData.location,
        frequency: formData.frequency,
        min_match_score: formData.minScore, // Pastikan nama kolom di Prisma sesuai (misal: min_match_score)
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        user_id: user.id,
        email: user.email as string,
        job_title: formData.jobTitle,
        location: formData.location,
        frequency: formData.frequency,
        min_match_score: formData.minScore,
        is_active: true,
      },
    });

    // Revalidate biar dashboard langsung ambil data loker baru berdasarkan keyword ini
    revalidatePath("/dashboard");

    return { success: true, data: alert };
  } catch (error: any) {
    console.error("Error saving alert with Prisma:", error);
    return { success: false, error: error.message };
  }
}
