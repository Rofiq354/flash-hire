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
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Autentikasi gagal. Silahkan coba lagi.";

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(message)}`,
    );
  }
}
