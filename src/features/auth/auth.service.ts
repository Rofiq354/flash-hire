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
    .select("id, job_title, country, phone_number")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("PROFILE_CHECK_FAILED");
  }

  if (mode === "login" && !profile) {
    await supabase.auth.signOut();
    throw new Error("LOGIN_WITHOUT_PROFILE");
  }

  const isProfileIncomplete =
    !profile || !profile.job_title || !profile.country || !profile.phone_number;

  if (isProfileIncomplete) {
    return { redirect: "/register/onboarding" };
  }

  return { redirect: "/my-cv" };
}
