"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createJobAlert(formData: FormData) {
  try {
    const supabase = createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id;
    if (!userId) return { success: false, message: "You must be logged in" };

    const rawIsRemote = formData.get("is_remote");
    // Ambil data dari FormData
    const job_title = formData.get("job_title") as string;
    const location = formData.get("location") as string;
    const is_remote = rawIsRemote === "on";
    const frequency = formData.get("frequency") as string;
    const email = formData.get("email") as string;
    const min_match_score = parseInt(formData.get("min_match_score") as string) || 70;

    await prisma.job_alerts.upsert({
      where: { user_id: userId },
      update: {
        job_title,
        location,
        is_remote,
        frequency,
        email,
        min_match_score,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        job_title,
        location,
        is_remote,
        frequency,
        email,
        min_match_score,
      },
    });

    revalidatePath("/job-alert");
    return { success: true, message: "Job alert activated!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed to save alert." };
  }
}