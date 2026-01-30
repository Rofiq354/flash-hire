"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ExtractionLoading } from "@/components/molecules/ExtractionLoading";
import { uploadAndAnalyzeCV } from "./cv-action";
import { DashboardInitial } from "@/components/organisms/DashboardInitial";
import { ProfileCompletion } from "@/components/organisms/ProfileCompletion";
import { JobCard } from "@/components/molecules/JobCard";
import JobAlertModal from "@/components/organisms/JobAlertModal";

export default function DashboardPage() {
  const [status, setStatus] = useState<"idle" | "analyzing" | "completed">(
    "idle",
  );
  const [profileData, setProfileData] = useState<null | any>(null);
  const [user, setUser] = useState<any>(null);
  const [rawJobs, setRawJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [alertData, setAlertData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const supabase = createClient();

  // 1. Fetch User saat pertama kali load
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // 2. Fetch Job Alert setelah User ID didapatkan
  useEffect(() => {
    if (!user) return;

    const fetchAlert = async () => {
      const { data } = await supabase
        .from("job_alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) setAlertData(data);
    };

    fetchAlert();
  }, [user]);

  // 3. Fetch Jobs dari API Route setelah Alert Data didapatkan
  useEffect(() => {
    if (!alertData) return;

    async function loadJobs() {
      setLoadingJobs(true);
      try {
        const response = await fetch(
          `/api/jobs?keyword=${encodeURIComponent(alertData.keyword)}&location=${encodeURIComponent(alertData.location || "indonesia")}`,
        );
        const data = await response.json();
        setRawJobs(data);
      } catch (err) {
        console.error("Gagal ambil loker:", err);
      } finally {
        setLoadingJobs(false);
      }
    }

    loadJobs();
  }, [alertData]);

  const handleUpload = async (file: File) => {
    setStatus("analyzing");
    try {
      const formData = new FormData();
      formData.append("cv", file);
      const result = await uploadAndAnalyzeCV(formData);

      if (result.success) {
        setProfileData(result.data);
        setStatus("completed");
      }
    } catch (error: any) {
      console.error("Client Error:", error);
      setStatus("idle");
    }
  };

  const handleAlertSuccess = (newAlert: any) => {
    setAlertData(newAlert);
    setShowModal(false);
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const fullName = user?.user_metadata?.full_name || "User";

  return (
    <main className="min-h-screen bg-slate-50/50 p-8">
      <JobAlertModal
        onSuccess={handleAlertSuccess}
        onClose={() => setShowModal(false)}
      />
      {/* {showModal && (
      )} */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Career Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Ready to find your next dream job?
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-full border border-slate-100 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {user ? getInitials(fullName) : "..."}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {fullName}
            </span>
          </div>
        </header>

        {/* Section Job Recommendation (US-06) */}
        {alertData && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
            {loadingJobs ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-slate-200 animate-pulse rounded-3xl"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rawJobs.map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Content Section (CV Flow) */}
        <div className="mt-10">
          {status === "idle" && <DashboardInitial onUpload={handleUpload} />}
          {status === "analyzing" && <ExtractionLoading />}
          {status === "completed" && (
            <ProfileCompletion
              name={fullName}
              data={profileData}
              onReset={() => setStatus("idle")}
            />
          )}
        </div>
      </div>
    </main>
  );
}
