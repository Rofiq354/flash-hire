import React from "react";
import { prisma } from "@/lib/prisma";
import JobClient from "./jobClient";
import { fetchAdzunaJobs } from "@/services/jobs/adzuna.service";
import { getCurrentUser } from "@/services/auth/user.service";

// Dummy data mengikuti NormalizedJob interface dari Adzuna
// const DUMMY_JOBS = [
//   {
//     id: "adz-1",
//     title: "Senior Frontend Engineer",
//     company: "Tokopedia",
//     location: "Jakarta, Indonesia",
//     locationType: "remote",
//     description: "Build scalable web applications using Next.js...",
//     postedDate: new Date(),
//     url: "#",
//     source: "adzuna",
//     salary: { min: 15000000, max: 25000000, currency: "IDR" },
//   },
//   {
//     id: "adz-2",
//     title: "Product Designer (UI/UX)",
//     company: "Gojek",
//     location: "South Jakarta",
//     locationType: "hybrid",
//     description: "Design seamless user experiences for millions...",
//     postedDate: new Date(),
//     url: "#",
//     source: "adzuna",
//   },
//   {
//     id: "adz-3",
//     title: "Backend Developer",
//     company: "Traveloka",
//     location: "Tangerang, ID",
//     locationType: "onsite",
//     description: "Develop robust microservices using Go...",
//     postedDate: new Date(),
//     url: "#",
//     source: "adzuna",
//     salary: { min: 18000000, currency: "IDR" },
//   },
// ];

export default async function Page() {
  const user = await getCurrentUser();
  const alertData = await prisma.job_alerts.findFirst({
    where: { user_id: user?.id },
  });

  const userCv = await prisma.cvs.findUnique({
    where: { user_id: user?.id },
  });

  // const jobs = await fetchAdzunaJobs({
  //   keyword: "Developer",
  //   location: "",
  //   page: 1,
  //   resultsPerPage: 5,
  //   maxDays: 14,
  // });
  const jobs = await fetchAdzunaJobs({
    keyword: alertData?.job_title || "Developer",
    location: (alertData?.location as string) || "",
    page: 1,
    resultsPerPage: 6,
    maxDays: 14,
  });
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto px-4 sm:px-6">
        <JobClient initialJobs={jobs.jobs} initialCv={userCv} />

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
