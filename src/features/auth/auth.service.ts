// src/features/auth/auth.service.ts
import { SupabaseClient } from "@supabase/supabase-js";

export async function handleOAuthCallback(
  supabase: SupabaseClient,
  code: string,
  mode: "login" | "register",
) {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    throw new Error("AUTH_FAILED");
  }

  const user = data.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("PROFILE_CHECK_FAILED");
  }

  if (mode === "login" && !profile) {
    await supabase.auth.signOut();
    throw new Error("LOGIN_WITHOUT_PROFILE");
  }

  if (mode === "register" && profile) {
    return { redirect: "/dashboard" };
  }

  return { redirect: "/dashboard" };
}
