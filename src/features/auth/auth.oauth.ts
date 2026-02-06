// src/features/auth/auth.oauth.ts

"use client";

import { createClient } from "@/utils/supabase/client";
import { AuthMode } from "./auth.types";

export async function signInWithGoogle(mode: AuthMode) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback?mode=${mode}`,
      queryParams: {
        prompt: "select_account",
      },
      data: {
        allow_signup: mode === "register",
      },
    } as any,
  });

  if (error) {
    throw error;
  }
}
