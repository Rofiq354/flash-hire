// src/app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const mode = searchParams.get("mode"); // 'login' atau 'register'

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Cek apakah user ini baru saja dibuat di database (user baru)
      const isNewUser = data.user.created_at === data.user.last_sign_in_at;

      if (mode === "login" && isNewUser) {
        // Jika niatnya Login tapi akunnya baru (belum pernah register), PAKSA LOGOUT
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/login?error=Belum terdaftar. Silahkan register terlebih dahulu.`,
        );
      }

      // Jika mode register dan memang user baru, atau mode login dan user lama, lanjut ke dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=Autentikasi gagal. Silahkan register terlebih dahulu.`,
  );
}
