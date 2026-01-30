"use server";

import { createClient } from "@/utils/supabase/server";
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

  const { error } = await supabase.from("job_alerts").insert({
    user_id: user.id,
    keyword: formData.jobTitle,
    location: formData.location,
    frequency: formData.frequency,
    is_active: true,
    // Note: Jika kamu belum tambah kolom min_score di DB,
    // bagian ini bisa di-comment dulu atau ditambahkan via Prisma
    // min_score: formData.minScore
  });

  if (error) {
    console.error("Error saving alert:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
