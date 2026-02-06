// src/app/dashboard/upload/page.tsx
import { getCurrentUser } from "@/services/auth/user.service";
import UploadClient from "./UploadClient";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const user = await getCurrentUser();

  const latestCv = await prisma.cvs.findFirst({
    where: { user_id: user?.id },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto px-4 sm:px-6">
        {!latestCv && (
          <header className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Boost Your Career with AI
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Upload your resume and let our AI match you with the most relevant
              job opportunities in seconds.
            </p>
          </header>
        )}

        <UploadClient initialCv={latestCv} />
      </div>
    </div>
  );
}
