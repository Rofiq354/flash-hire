// src/services/auth/user.service.ts
import { createClient } from "@/utils/supabase/server";

export async function getCurrentUser() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null; // atau throw redirect("/login")
  }

  // Ambil profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // console.log(profile);

  if (profileError) {
    console.error("Error fetching profile:", profileError.message);
  }

  return {
    ...user,
    profile,
  };
}
