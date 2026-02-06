// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { handleOAuthCallback } from "@/features/auth/auth.service";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const mode = searchParams.get("mode") as "login" | "register" | null;

  if (!code || !mode) {
    return NextResponse.redirect(
      `${origin}/login?error=Invalid authentication request`,
    );
  }

  const supabase = createClient();

  try {
    const result = await handleOAuthCallback(supabase, code, mode);

    return NextResponse.redirect(`${origin}${result.redirect}`);
  } catch (error: any) {
    let message = "Autentikasi gagal.";

    if (error.message === "LOGIN_WITHOUT_PROFILE") {
      message = "Akun tidak ditemukan. Silahkan daftar terlebih dahulu.";
    } else if (error.message === "AUTH_FAILED") {
      message = "Gagal menghubungkan ke Google.";
    }

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(message)}`,
    );
  }
}
