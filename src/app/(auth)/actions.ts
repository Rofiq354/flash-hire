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

  return redirect("/dashboard");
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

  // Jika berhasil, Supabase otomatis mengatur cookie session
  return redirect("/dashboard");
}

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
  }

  return redirect("/login");
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

  // 2. Inisialisasi Admin Client (Butuh Service Role Key)
  // Ini diperlukan karena user biasa tidak punya izin hapus di auth.users
  const supabaseAdmin = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Ambil dari Dashboard Supabase -> Settings -> API
  );

  // 3. Hapus User
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    return { error: error.message };
  }

  // 4. Logout dan bersihkan cookies
  await supabaseServer.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login?message=Akun berhasil dihapus");
}
