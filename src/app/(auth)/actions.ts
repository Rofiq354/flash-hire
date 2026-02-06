// src/app/(auth)/login/actions.ts
"use server";

import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    console.error("Registrasi Gagal:", error.message);
    return redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  console.log("Registrasi Berhasil!");

  return redirect("/register/onboarding");
}

export async function completeOnboarding(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return redirect("/login");
  }

  const job_title = (formData.get("job_title") as string)?.trim();
  const country = formData.get("country") as string;
  const location = (formData.get("location") as string)?.trim();
  const phone_number = (formData.get("phone_number") as string)?.trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      job_title,
      country,
      location,
      phone_number,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Gagal update profil:", error.message);
    return redirect(
      `/register/onboarding?error=${encodeURIComponent("Failed to update profile. Please try again.")}`,
    );
  }

  return redirect("/my-cv");
}

export async function signIn(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Mencoba login user:", email);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login Gagal:", error.message);
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  console.log("Login Berhasil! Mengalihkan ke dashboard...");

  return redirect("/dashboard");
}

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
  }

  return redirect("/");
}

export async function deleteAccount() {
  const supabaseServer = createClient();

  // 1. Cek apakah user sedang login
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    throw new Error("Kamu harus login untuk menghapus akun.");
  }

  const supabaseAdmin = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    return { error: error.message };
  }

  await supabaseServer.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login?message=Akun berhasil dihapus");
}
