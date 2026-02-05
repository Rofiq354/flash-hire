// src/app/(app)/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { fetchAdzunaJobs } from "@/services/jobs/adzuna.service";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/auth/user.service";

export default async function DashboardPage() {
  const userProfile = await getCurrentUser();

  // Ambil data job alert
  const alertData = await prisma.job_alerts.findFirst({
    where: { user_id: userProfile?.id },
  });

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  // Cari CV user
  const userCv = await prisma.cvs.findUnique({
    where: { user_id: userProfile?.id },
  });

  // Kalau belum ada CV, redirect ke upload page
  if (!userCv) {
    redirect("/my-cv");
  }

  const finalKeyword =
    alertData?.job_title ||
    userProfile?.profile?.job_title ||
    "Software Engineer";

  const jobs = await fetchAdzunaJobs(
    {
      keyword: finalKeyword,
      location: (alertData?.location as string) || "",
      page: 1,
      resultsPerPage: 2,
      maxDays: 14,
    },
    userId, // <--- TAMBAHKAN INI DI SINI
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto px-4 sm:px-6">
        <DashboardClient
          initialUser={user}
          initialCv={userCv}
          initialAlert={alertData}
          fetchedJobs={jobs.jobs}
        />

        {/* Static Footer */}
        <footer className="mx-auto mt-16 border-t border-border-custom pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-2 font-bold text-slate-400 uppercase tracking-tighter">
            <span className="text-primary italic">⚡ Flash Hire</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Help Center
            </a>
          </div>
          <p>© 2024 Flash Hire AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
