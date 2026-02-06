// src/app/(dashboard)/job-alert/page.tsx
import JobAlertClient from "./JobAlertClient";
import { createClient } from "@/utils/supabase/server";

export default async function JobAlertPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto py-10 px-4">
      <JobAlertClient initialEmail={user?.email} />
    </div>
  );
}
